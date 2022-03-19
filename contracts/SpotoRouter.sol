//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./SpotoCoin.sol";
import "./LiquidityPool.sol";

contract SpotoRouter {
    LiquidityPool liquidityPool;
    SpotoCoin spotoCoin;

    constructor(LiquidityPool _liquidityPool, SpotoCoin _spotoCoin) {
        liquidityPool = _liquidityPool;
        spotoCoin = _spotoCoin;
    }

    function addLiquidity(uint256 _sptAmount) external payable {
        require(spotoCoin.balanceOf(msg.sender) > 0, "NO_AVAILABLE_TOKENS");

        bool success = spotoCoin.increaseContractAllowance(
            msg.sender,
            address(this),
            _sptAmount
        );
        require(success);

        spotoCoin.transferFrom(msg.sender, address(liquidityPool), _sptAmount);
        liquidityPool.deposit{value: msg.value}(_sptAmount, msg.sender);
    }

    function pullLiquidity() external {
        liquidityPool.withdraw(msg.sender);
    }

    function swapTokens(uint256 _sptAmount) external payable {
        bool success = spotoCoin.increaseContractAllowance(
            msg.sender,
            address(this),
            _sptAmount
        );
        require(success);

        spotoCoin.transferFrom(msg.sender, address(liquidityPool), _sptAmount);
        liquidityPool.swap{value: msg.value}(msg.sender, _sptAmount);
    }
}
