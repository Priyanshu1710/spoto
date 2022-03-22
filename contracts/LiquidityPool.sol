//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./LPT.sol";
import "./SpotoCoin.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@uniswap/lib/contracts/libraries/Babylonian.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is Ownable {
    event LiquidityAdded(address indexed _account);
    event LiquidityRemoved(address indexed _account);
    event TradedTokens(
        address indexed _account,
        uint256 _ethTraded,
        uint256 _sptTraded
    );

    LPT lpToken;
    SpotoCoin spotoCoin;
    uint256 ethReserve;
    uint256 sptReserve;
    uint32 lastBlockTimestamp;

    function setLPTAddress(LPT _lpToken) external onlyOwner {
        require(address(lpToken) == address(0), "WRITE_ONCE");
        lpToken = _lpToken;
    }

    function getReserves() external view returns (uint256, uint256) {
        return (ethReserve, sptReserve);
    }

    function setSpotoCoinAddress(SpotoCoin _spotoCoin) external onlyOwner {
        require(address(spotoCoin) == address(0), "WRITE_ONCE");
        spotoCoin = _spotoCoin;
    }

    function swap(address account, uint256 _sptAmount) external payable {
        uint256 product = ethReserve * sptReserve;
        uint256 amountToTransfer;
        uint256 amountToTake;
        uint256 totalAmountToTransfer;

        if (msg.value == 0) {
            uint256 currentSPTBalance = spotoCoin.balanceOf(address(this));
            uint256 _sptAmountMinusTax = _sptAmount - ((2 * _sptAmount) / 100);
            uint256 addedBalance = sptReserve + _sptAmountMinusTax;

            require(addedBalance == currentSPTBalance, "DID_NOT_TRANSFER");

            /*
             *
             * 100 eth   * 500 spt = 50000
             *      x    * 600 spt = 50000
             *
             *  x = 50000 / 600 = 83,33
             *  user gets 100 - x = 16.67
             */

            uint256 x = product / (sptReserve + _sptAmountMinusTax);
            amountToTransfer = ethReserve - x;

            amountToTake = (1 * amountToTransfer) / 100;
            totalAmountToTransfer = amountToTransfer - amountToTake;

            (bool success, ) = account.call{value: totalAmountToTransfer}("");

            require(success, "TRANSFER_FAILED");
        } else {
            /*
             *
             * 100 eth   * 500 spt = 50000
             * 105 eth * y     = 50000
             *
             *  y = 50000 / 105 = 476,19
             *  user gets 500 - y = 23,81
             */

            uint256 y = product / (ethReserve + msg.value);
            amountToTransfer = sptReserve - y;

            amountToTake = (1 * amountToTransfer) / 100;
            totalAmountToTransfer = amountToTransfer - amountToTake;

            spotoCoin.transfer(account, totalAmountToTransfer);
        }
        emit TradedTokens(account, msg.value, _sptAmount);
        _update();
    }

    function deposit(uint256 sptAmount, address account) external payable {
        uint256 liquidity;
        uint256 totalSupply = lpToken.totalSupply();
        uint256 ethAmount = msg.value;

        if (totalSupply > 0) {
            liquidity = Math.min(
                (ethAmount * totalSupply) / ethReserve,
                (sptAmount * totalSupply) / sptReserve
            );
        } else {
            liquidity = Babylonian.sqrt(ethAmount * sptAmount);
        }

        lpToken.mint(account, liquidity);
        emit LiquidityAdded(account);
        _update();
    }

    function withdraw(address account) external {
        uint256 liquidity = lpToken.balanceOf(account);
        require(liquidity != 0, "NO_AVAILABLE_TOKENS");

        uint256 totalSupply = lpToken.totalSupply();

        uint256 ethAmount = (ethReserve * liquidity) / totalSupply;
        uint256 sptAmount = (sptReserve * liquidity) / totalSupply;

        lpToken.burn(account, liquidity);

        (bool ethTransferSuccess, ) = account.call{value: ethAmount}("");
        bool sptTransferSuccess = spotoCoin.transfer(account, sptAmount);

        require(ethTransferSuccess && sptTransferSuccess, "FAILED_TRANSFER");
        emit LiquidityRemoved(account);
        _update();
    }

    function _update() private {
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed;
        unchecked {
            timeElapsed = blockTimestamp - lastBlockTimestamp; // If new block, overflows
        }

        if (timeElapsed > 0) {
            ethReserve = address(this).balance;
            sptReserve = spotoCoin.balanceOf(address(this));
            lastBlockTimestamp = blockTimestamp;
        }
    }
}
