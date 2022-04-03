// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;
import "hardhat/console.sol"; //For debugging only

import './SafeMath.sol';
import "./ERC20Token.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool is ERC20Token {

    using SafeMath for uint;
    address public addressTokenB; 
    address public owner; 
    uint256 public reserveTokenEth;
    uint256 public reserveTokenB;
    uint32 private blockTimestampLast;
    uint256 public priceTokenEth;
    uint256 public priceTokenB;
    // XXX TODO Add fees

    event Sync(uint256 reserveTokenEth, uint256 reserveTokenB);

    event MintLPToken(address indexed from, uint256 amountTokenEth, uint256 amountTokenB);
    event BuySPTToken(uint amountin , uint amountout );
    event SellSPTToken(uint amountin , uint amountout );

    constructor(
        string memory _name,
        string memory _symbol,
        address _addressTokenB,
        uint256 _priceTokenEth,
        uint256 _priceTokenB

    ) ERC20Token(0, _name, _symbol) {
        addressTokenB = _addressTokenB;
        owner = msg.sender;
        priceTokenEth=_priceTokenEth;
        priceTokenB= _priceTokenB;
        IERC20.permit
        ERC20Token(addressTokenB).approve(address(this),10000000000*10**22);
    }

    function addLiquidity(
    ) public payable returns (bool success) {
        
        uint256 _amountTokenEth=msg.value;
        uint256 _amountTokenB=(_amountTokenEth*priceTokenEth)/priceTokenB;
        ERC20Token(addressTokenB).approve(address(this),10000000000*10**22);

        ERC20Token tokenB = ERC20Token(addressTokenB);
        require(
            tokenB.transferFrom(msg.sender, address(this), _amountTokenB),
            "Tranfer of token failed"
        );

        mint(msg.sender); // mint new LP tokens

        return true;
    }


    function mint(address to) internal returns (uint liquidity) {
        uint256 _balanceTokenEth = address(this).balance;
        uint256 _balanceTokenB = ERC20Token(addressTokenB).balanceOf(address(this));
        
        uint256 _reserveTokenEth = reserveTokenEth;
        uint256 _reserveTokenB = reserveTokenB;

        uint256 _amountTokenEth = _balanceTokenEth - _reserveTokenEth;
        uint256 _amountTokenB = _balanceTokenB - _reserveTokenB;
        
        uint256 _totalSupply = totalSupply; 
        if (_totalSupply == 0) { 
            liquidity = _amountTokenEth * _amountTokenB / _amountTokenB; 
        } else {
            liquidity = _amountTokenEth * _amountTokenB / _amountTokenB;
        }
        require(liquidity > 0, 'Liquidity added invalid');
        _mint(to, liquidity);
        _update(_balanceTokenEth, _balanceTokenB, _reserveTokenEth, _reserveTokenB); 
        emit MintLPToken(msg.sender, _amountTokenEth, _amountTokenB);
    }


     function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    function sellSptToken(uint256 amountIn) public
    {
         uint reserveIn=reserveTokenB;
         uint reserveout=reserveTokenEth;
         uint amountout=getAmountOut( amountIn, reserveIn, reserveout);
         ERC20Token(addressTokenB).approve(address(this),10000000000*10**22);

         payable(msg.sender).transfer(amountout);
         reserveTokenB=reserveTokenB+amountIn;
         reserveTokenEth=reserveTokenEth-amountout;
         emit SellSPTToken(amountIn,amountout);


    }

    function buyspttoken( ) public payable
    {    
         uint amountIn=msg.value;
         uint reserveIn=reserveTokenEth;
         uint reserveout=reserveTokenB;
         uint amountout=getAmountOut( amountIn, reserveIn, reserveout);
         ERC20Token(addressTokenB).approve(address(this),10000000000*10**22);
        ERC20Token(addressTokenB).transferFrom(address(this),msg.sender,amountout);
        reserveTokenB=reserveTokenB-amountout;
         reserveTokenEth=reserveTokenEth+msg.value;
         emit BuySPTToken(amountIn,amountout);
    }

    function _update(
        uint256 _balanceTokenEth,
        uint256 _balanceTokenB,
        uint256 _reserveTokenEth,
        uint256 _reserveTokenB
    ) private {
        require(_balanceTokenEth >= 0 && _balanceTokenB >= 0, "Invalid balances");
        if(_reserveTokenEth > 0 && _reserveTokenB > 0) {
            priceTokenEth += _reserveTokenEth / _reserveTokenB;
            priceTokenB += _reserveTokenB / _reserveTokenEth;
        }
        reserveTokenEth = _balanceTokenEth;
        reserveTokenB = _balanceTokenB;
        emit Sync(reserveTokenEth, reserveTokenEth);
    }

    function sync() external {
        _update(
            address(this).balance,
            ERC20Token(addressTokenB).balanceOf(address(this)),
            reserveTokenEth,
            reserveTokenB
        );
    }
}