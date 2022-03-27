// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";


contract faucet {

    address coin_addr;
    address private _owner;
    constructor(address _coin_addr)  {
        _owner = msg.sender;
        coin_addr=_coin_addr;
    }

    event Faucet(address recipient,uint test_tokens);

    function receive_test_token() public{
        require(IERC20(address(coin_addr)).balanceOf(address(this))>10*10**18);
        IERC20(address(coin_addr)).approve(address(this),100*10**18);
        IERC20(address(coin_addr)).transfer(msg.sender,10*10**18);
        emit Faucet(msg.sender,10*10**18);
    }

    function balanceOf() public view returns(uint )
    {
        return IERC20(address(coin_addr)).balanceOf(address(this));
    }


}