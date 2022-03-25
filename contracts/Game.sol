// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MultiBetContract is Ownable{

    AggregatorV3Interface internal priceFeed;
    address private _owner;
    address private coin_addr;
    uint256 public betCount;
    struct nft_profile{
        string nft_token_id;
        uint256 bets_won;
        uint256 bets_lost;
        uint256 profile_level;
    }

    int eth_price;

    enum Result { HOMETEAMWIN, AWAYTEAMWIN, DRAW, PENDING, UNKNOWN }
    struct Game {
        uint256 gameId;
        bool completed;
    }

    struct BettingEvent{
        
        uint256 bettingPairId; /*Monotonically increasing Id within the smart contract.*/
        uint256 matchid;
        
        address player1;
        address player2;
        string nftid_player1;
        string nftid_player2;

        uint256 player1Deposit;
        uint256 player2Deposit;

        uint256 player1GamePrediction;
        uint256 player2GamePrediction;


        bool gameFinished;
        bool withdrawCompleted;
        address  theWinner;
        address refund_player1;
        address refund_player2;
        uint256 gains;
    }
    
    mapping(uint256 => BettingEvent) bettingEventMap; 
    mapping(uint256 => uint256) bet_to_Matchid;
    mapping(uint256 => Game) matchid_to_game;
    mapping(uint256 =>uint256[]) betsinmatch;
    mapping(string =>nft_profile) nftmapping;
    mapping(address =>mapping(uint256 =>uint256[])) mymatches;

    event BetCreated(address player1, uint256 betId , uint256 deposit , string nft_id);
	event Betjoined(address player2, uint256 betId, uint256 deposit , string nft_id);
    event Withdraw(uint256 bet_id,address winner, uint256 gains);

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    /**
     * Network: Mainnet
     * Aggregator: ETH/USD
     * Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
     */
    constructor(address _coin_addr,address AggregatorAddress)  {
        _owner = msg.sender;
        betCount = 0;
        coin_addr=_coin_addr;
        priceFeed = AggregatorV3Interface(AggregatorAddress);


    }

    function SetLatestEthPrice() external {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        eth_price=price;
    }

    function getLatestEthPrice() public view returns (int) {
        
        return eth_price;
    }




    function createBet(uint256 match_id,uint256 winner_prediction,string memory nft_id ,uint256 amount) public  {
        require(amount!=0,"Cannot have zero bet amount");
        betCount++;
        IERC20(address(coin_addr)).approve(msg.sender,amount);
        IERC20(address(coin_addr)).transferFrom(msg.sender, address(this), amount);
        bettingEventMap[betCount].bettingPairId = betCount;
        bettingEventMap[betCount].player1 = msg.sender;
        bettingEventMap[betCount].player1Deposit = amount;
        bettingEventMap[betCount].player1GamePrediction=winner_prediction;
        bettingEventMap[betCount].nftid_player1=nft_id;
        bet_to_Matchid[betCount]=match_id;
        betsinmatch[match_id].push(betCount);
        emit BetCreated(msg.sender, betCount,bettingEventMap[betCount].player1Deposit,bettingEventMap[betCount].nftid_player1);
    }
    function balanceOf(address a) public view returns (uint256) 
    {    return IERC20(address(coin_addr)).balanceOf(a);}


    
    function joinBet(uint256 interestedBet, uint256 winner_prediction , string memory nft_id,uint256 amount) public  {
    	require(!bettingEventMap[interestedBet].gameFinished ,"Match finished");
        require(bettingEventMap[interestedBet].player2 == address(0),"Bet slot already booked");  
        require(msg.sender != bettingEventMap[interestedBet].player1,"Cannot join with same ID");  
        require(bettingEventMap[interestedBet].player1GamePrediction!=winner_prediction,"cannot bet on same outcome");  
        require(amount==bettingEventMap[interestedBet].player1Deposit,"Amount should be the matching bet only");  

        IERC20(address(coin_addr)).approve(msg.sender,amount);

        IERC20(address(coin_addr)).transferFrom(msg.sender, address(this), amount);

        bettingEventMap[interestedBet].player2 = msg.sender;        
        bettingEventMap[interestedBet].player2Deposit = amount;
        bettingEventMap[interestedBet].player2GamePrediction = winner_prediction; 
        bettingEventMap[interestedBet].nftid_player2=nft_id;
    	emit Betjoined(msg.sender, betCount,bettingEventMap[betCount].player2Deposit,bettingEventMap[betCount].nftid_player2);

    }

    
    // winner team : 0 (for Home) : 1 for (Away) 2: For tie
    function update_winner(uint256 match_id,uint256 winner_team,bool completed)  public 
    {
        require(msg.sender==_owner ,"unauthorized");
        require(completed,"match_not_completed");
        uint256[] memory available_bets=betsinmatch[match_id];
        for (uint256 i=0;i<available_bets.length;i++)
        {
            uint256  current_bet=available_bets[i];
            BettingEvent memory bet_details=bettingEventMap[current_bet];
            if(bet_details.player2==address(0))
            {   bet_details.gameFinished = true;
                bet_details.gains=bet_details.player1Deposit;
                bet_details.theWinner = bet_details.player1;
            }

            else{
                    bet_details.gameFinished = true;
                    bet_details.gains=bet_details.player1Deposit+bet_details.player1Deposit-((15*(bet_details.player1Deposit+bet_details.player1Deposit))/100);
                    if (winner_team==bet_details.player1GamePrediction)
                    {bet_details.theWinner = bet_details.player1;
            
                     nftmapping[bet_details.nftid_player1].bets_won=nftmapping[bet_details.nftid_player1].bets_won+1;
                     nftmapping[bet_details.nftid_player2].bets_lost=nftmapping[bet_details.nftid_player2].bets_lost+1;
                     nftmapping[bet_details.nftid_player1].profile_level=nftmapping[bet_details.nftid_player1].profile_level+10*(nftmapping[bet_details.nftid_player1].bets_won/(nftmapping[bet_details.nftid_player1].bets_won+nftmapping[bet_details.nftid_player1].bets_lost));
                    }


                    else if (winner_team==bet_details.player2GamePrediction)
                    {bet_details.theWinner = bet_details.player2;
                     nftmapping[bet_details.nftid_player2].bets_won=nftmapping[bet_details.nftid_player2].bets_won+1;
                     nftmapping[bet_details.nftid_player1].bets_lost=nftmapping[bet_details.nftid_player1].bets_lost+1;
                     nftmapping[bet_details.nftid_player2].profile_level=nftmapping[bet_details.nftid_player2].profile_level+10*(nftmapping[bet_details.nftid_player2].bets_won/(nftmapping[bet_details.nftid_player2].bets_won+nftmapping[bet_details.nftid_player2].bets_lost));                    
                    }

                    else 

                    //draw logic
                    { 
                    bet_details.refund_player1=bet_details.player1;
                    bet_details.refund_player2=bet_details.player2;
                     }

                    bettingEventMap[current_bet]=bet_details;

            }
        }
    }
    
function withdraw(uint256 interestedBet) public {
        require(bettingEventMap[interestedBet].gameFinished,"Game not Finished");
        require(!bettingEventMap[interestedBet].withdrawCompleted,"Amount already withdrawn");      
        require(((bettingEventMap[interestedBet].theWinner == msg.sender)||bettingEventMap[interestedBet].refund_player1 == msg.sender)||
                bettingEventMap[interestedBet].refund_player2 == msg.sender,"Unauthorized Withdrawl");            

        uint256 amount;
        if (bettingEventMap[interestedBet].theWinner == msg.sender)
        { amount = bettingEventMap[interestedBet].gains;}
        else if(bettingEventMap[interestedBet].refund_player1 == msg.sender)
        { amount = bettingEventMap[interestedBet].player1Deposit;}
        else 
        { amount = bettingEventMap[interestedBet].player2Deposit;}
        // Clean out the current state
        bettingEventMap[interestedBet].gains = 0;
        bettingEventMap[interestedBet].withdrawCompleted = true;
        IERC20(address(coin_addr)).transfer(msg.sender,amount);
        emit Withdraw(interestedBet,msg.sender,amount);
    }

 
      
    
function getPlayer1Details(uint256 interestedBet) public view returns (address p1, uint256 player1Deposit, uint256 player1gamePrediction ,string memory player1nft) {
        p1 = bettingEventMap[interestedBet].player1;
        player1Deposit = bettingEventMap[interestedBet].player1Deposit;
        player1gamePrediction = bettingEventMap[interestedBet].player1GamePrediction;
        player1nft=bettingEventMap[interestedBet].nftid_player1;
    }
    
    function getPlayer2Details(uint256 interestedBet) public view returns (address p2, uint256 player2Deposit, uint256 player2gamePrediction,string memory player2nft) {
        p2 = bettingEventMap[interestedBet].player2;
        player2Deposit = bettingEventMap[interestedBet].player2Deposit;
        player2gamePrediction = bettingEventMap[interestedBet].player1GamePrediction;
        player2nft=bettingEventMap[interestedBet].nftid_player2;

    }
    
    function getBetDetails(uint256 interestedBet) public view returns (bool gameFinished, 
                                                                    bool withdrawCompleted, 
                                                                    address  theWinner, 
                                                                    uint256 gains,
                                                                    address player1,
                                                                    address player2,
                                                                    string memory nftid_player1,
                                                                    string memory nftid_player2,
                                                                    uint256 player1Deposit,
                                                                    uint256 player2Deposit,
                                                                    uint256 player1GamePrediction,
                                                                    uint256 player2GamePrediction
                                                                   ) {
        gameFinished = bettingEventMap[interestedBet].gameFinished;
        withdrawCompleted = bettingEventMap[interestedBet].withdrawCompleted;
        theWinner = bettingEventMap[interestedBet].theWinner;
        gains = bettingEventMap[interestedBet].gains;
        gains = bettingEventMap[interestedBet].gains;
        player1 = bettingEventMap[interestedBet].player1;
        player2 = bettingEventMap[interestedBet].player2;
        nftid_player1 = bettingEventMap[interestedBet].nftid_player1;
        nftid_player2 = bettingEventMap[interestedBet].nftid_player2;
        player1Deposit = bettingEventMap[interestedBet].player1Deposit;
        player2Deposit = bettingEventMap[interestedBet].player2Deposit;
        player1GamePrediction = bettingEventMap[interestedBet].player1GamePrediction;
        player2GamePrediction = bettingEventMap[interestedBet].player2GamePrediction;
    }
    
    function getActiveBets() public view returns (BettingEvent[] memory) {
        BettingEvent[] memory activeBets = new BettingEvent[](betCount);
        uint256 i = 0;
        for (i = 0 ; i < betCount ; i++) {
            activeBets[i] = bettingEventMap[i + 1];
        }
        return activeBets;
    }

    function getActiveBets_matchid(uint256 match_id) public view returns (BettingEvent[] memory) {
        uint256[] memory available_bet_id = betsinmatch[match_id];

        BettingEvent[] memory activeBets = new BettingEvent[](betCount);
        uint256 i = 0;
        for (i = 0 ; i < available_bet_id.length ; i++) {
            uint256 betid_tmp=available_bet_id[i];
            activeBets[i] = bettingEventMap[betid_tmp];
        }
        return activeBets;
    }

    function getNftDetails(string memory nftid) public view returns (string memory nft_token_id,
        uint256 bets_won,
        uint256 bets_lost,
        uint256 profile_level
                                                                   ) {
        bets_won = nftmapping[nftid].bets_won;
        bets_lost = nftmapping[nftid].bets_lost;
        profile_level = nftmapping[nftid].profile_level;
        nft_token_id = nftmapping[nftid].nft_token_id;
    }

    function availablebets(uint256  matchId) public view returns (uint256[]  memory available_bet_id
       
                                                                   ) {
        available_bet_id = betsinmatch[matchId];
        
    }

}