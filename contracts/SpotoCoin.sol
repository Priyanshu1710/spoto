//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./LiquidityPool.sol";
import "hardhat/console.sol";

contract SpotoCoin is ERC20 {
    event TokensBought(address indexed _account, uint256 amount);
    event OwnerAction();
    event FundsMoved();

    uint256 public MAX_SUPPLY;
    uint256 public constant TAX = 2; // 0.02, 2% of the tx;
    uint256 public totalContributed;
    bool public isContractPaused;
    bool public isTaxOn = true;
    address public owner;
    address payable public treasuryWallet;
    address public spotoRouter;

    mapping(address => uint256) public balancesToClaim;
    mapping(address => uint256) public contributionsOf;

    constructor(address payable treasury) ERC20("Spoto Coin", "SPT") {
        MAX_SUPPLY = 500000 * 10**decimals();
        _mint(address(this), MAX_SUPPLY);
        owner = msg.sender;
        treasuryWallet = treasury;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "OWNER_ONLY");
        _;
    }

    modifier routerOnly() {
        require(msg.sender == spotoRouter, "ROUTER_ONLY");
        _;
    }

    function setRouterAddress(address _spotoRouter) external ownerOnly {
        require(address(spotoRouter) == address(0), "WRITE_ONCE");
        spotoRouter = _spotoRouter;
    }

    modifier isPaused() {
        require(!isContractPaused, "CONTRACT_PAUSED");
        _;
    }

    function contribute() external payable isPaused {

        /*
         * The spec says that the exchange rate must be 5 tokens to 1 ether, so give the sender 5 times the ether they sent
         */
        uint256 tokenAmount = msg.value * 5;
        balancesToClaim[msg.sender] += tokenAmount;
        contributionsOf[msg.sender] += msg.value;
        totalContributed += msg.value;

        emit TokensBought(msg.sender, tokenAmount);
    }

    function claimTokens() external isPaused {
        require(balancesToClaim[msg.sender] > 0, "NO_AVAILABLE_FUNDS");
        uint256 tokensToClaim = balancesToClaim[msg.sender];
        balancesToClaim[msg.sender] = 0;

        super._transfer(address(this), msg.sender, tokensToClaim);
    }

    function togglePauseContract() external ownerOnly {
        isContractPaused = !isContractPaused;
        emit OwnerAction();
    }

    function toggleTax() external ownerOnly {
        isTaxOn = !isTaxOn;
        emit OwnerAction();
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        uint256 amountToTake;
        if (isTaxOn) {
            amountToTake = (TAX * amount) / 100;
        }
        uint256 amountToTransfer = amount - amountToTake;

        super._transfer(sender, recipient, amountToTransfer);
        super._transfer(sender, treasuryWallet, amountToTake);
    }

    function mint(address account, uint256 amount) external ownerOnly {
        require(account != address(0), "ERC20: mint to the zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "ABOVE_MAX_SUPPLY");

        _mint(account, amount * 10**decimals());
    }

    function burn(address account, uint256 amount) external ownerOnly {
        _burn(account, amount * 10**decimals());
    }

    function increaseContractAllowance(
        address _owner,
        address _spender,
        uint256 _amount
    ) public routerOnly returns (bool) {
        _approve(
            _owner,
            _spender,
            allowance(msg.sender, address(this)) + _amount
        );

        return true;
    }

    function sendLiquidityToLPContract(LiquidityPool liquidityPool)
        external
    {
        uint256 spotoCoinAmountToTransfer = totalContributed * 5;

        super._transfer(
            address(this),
            address(liquidityPool),
            spotoCoinAmountToTransfer
        );

        liquidityPool.deposit{value: totalContributed}(
            spotoCoinAmountToTransfer,
            address(this)
        );

        sendRemainingFundsToTreasury();
    }

    function sendRemainingFundsToTreasury() internal {
        uint256 remainingSPT = balanceOf(address(this));

        super._transfer(address(this), address(treasuryWallet), remainingSPT);
        emit FundsMoved();
    }
}
