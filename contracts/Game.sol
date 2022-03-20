pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Game is IERC20 {
IERC20 public daiInstance;


    struct lookup{
        uint256 matchid;
        uint256[] teamplayerid;
        uint256[] teamplayerpoints;
        bool iscompleted;
    }

    

    struct poolinfo{
        uint256 poolid;
        uint256 totalsize;
        uint256 totalvalue;
        uint256 fee;
        uint256 winner;
    }


    struct playerresult{
        uint256 totalpoint;
        bool won;
    }

    struct nftid_info{
        uint256 match_won;
        uint256 match_lost;
        uint256 profile_level;
    }

    mapping(uint256 => address) public address_nft;
    mapping(uint256 => lookup) public matchid_gameinfo;
    mapping(uint256 => mapping(uint256 => uint256[]))   matchid_poolid_playerid;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => myteam)))  matchid_poolid_playerid_playerteam;
    mapping(uint256 => mapping(uint256 => uint256[]))   matchid_poolid_playertotal;
    mapping(uint256 => mapping(uint256 => poolinfo)) public poolid_poolinfo;
    mapping(uint256 => mapping(uint256 => mapping(uint256 =>playerresult))) public match_pool_playerresult;
    mapping(uint256 => nftid_info) public nftprofile;
    mapping(uint256 => mapping(uint256 => uint256[]))   matchid_poolid_nftwinner;
    mapping(uint256 => mapping(uint256 => address[]))   matchid_poolid_nftwinneraddress;

    struct myteam{
        uint256[]  team;
    }

    function participate_in_pool(address user_addr,uint256 nftid ,uint256 matchid ,uint256 poolid,uint256[] memory team)
    public 
    payable
  { 
    poolinfo memory plinfo=getpoolinfo(matchid,poolid);
    uint fee =plinfo.fee;  
    bool success = daiInstance.transferFrom(msg.sender, address(this), fee);

    matchid_poolid_playerid[matchid][poolid].push(nftid);
    matchid_poolid_playerid_playerteam[matchid][poolid][nftid]=myteam({team:team});
    address_nft[nftid]=user_addr;
    
  }
   
   function updateMatchInfo  (uint256 matchid ,uint256[] memory teamplayerid,uint256[] memory team,bool isCompleted)
    public 
  { 
    matchid_gameinfo[matchid]=lookup(matchid,teamplayerid,team,isCompleted);  
  }

  function getmatchinfo(uint256 matchid)
    public
    view
    returns (lookup memory)
  {
      lookup memory x=matchid_gameinfo[matchid];
      return x;
    
  }

  function calculatepoints(uint256[] memory teamplayerpoints,uint256[] memory team)
  private
  pure
  returns (uint256)
  {
      uint256  length=teamplayerpoints.length;
      uint256  total =0;
      for(uint256 a=0;a<length;a++)
      {
          total=total+teamplayerpoints[a]*team[a];
      }

      return total;

  }

function setmatchcompleted(uint256 matchid)
  public 
  
  {
    lookup memory x=matchid_gameinfo[matchid];
    x.iscompleted=true;

    matchid_gameinfo[matchid]=x;

  }
  function checkmatchcompleted(uint256 matchid)
  private 
  view
  returns(bool)
  {
    lookup memory x=matchid_gameinfo[matchid];
    bool iscompleted=  x.iscompleted;
    return iscompleted;

  }
  function quickSort(uint[] memory arr, int left, int right)public  pure {
    int i = left;
    int j = right;
    if (i == j) return;
    uint pivot = arr[uint(left + (right - left) / 2)];
    while (i <= j) {
        while (arr[uint(i)] < pivot) i++;
        while (pivot < arr[uint(j)]) j--;
        if (i <= j) {
            (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
            i++;
            j--;
        }
    }
    if (left < j)
        quickSort(arr, left, j);
    if (i < right)
        quickSort(arr, i, right);
}
  function resolvewinner(uint256 matchid,uint256 poolid)
  public
  {
      
      uint256[] memory allplayers=matchid_poolid_playerid[matchid][poolid];
      uint256  length=allplayers.length;

      for(uint256 a=0;a<length;a++)
      {
          uint256 nftid = allplayers[a];
          myteam memory team_tmp=matchid_poolid_playerid_playerteam[matchid][poolid][nftid];
          lookup memory x=matchid_gameinfo[matchid];
          uint256  totalplayerpoint=calculatepoints(team_tmp.team,x.teamplayerpoints);
          matchid_poolid_playertotal[matchid][poolid].push(totalplayerpoint); 
         // playerresult storage pl=match_pool_playerresult[matchid][poolid][nftid]
          playerresult memory result_player= playerresult(totalplayerpoint,false);
          match_pool_playerresult[matchid][poolid][nftid]=result_player;

          
      }

      quickSort(matchid_poolid_playertotal[matchid][poolid], int(0), int(matchid_poolid_playertotal[matchid][poolid].length - 1));
      poolinfo memory pool = poolid_poolinfo[matchid][poolid];
      uint256  top_winners = pool.winner;
      uint256  thres=matchid_poolid_playertotal[matchid][poolid].length;
      uint256 margin_limit = (100-top_winners)*thres/100;
      uint256  value=matchid_poolid_playertotal[matchid][poolid][margin_limit];
      for(uint256 k=0;k<length;k++)
      {
          uint256 nftid_tmp = allplayers[k];
          
          playerresult memory result_player1=match_pool_playerresult[matchid][poolid][nftid_tmp];
          if (result_player1.totalpoint>value)
          {result_player1.won=true;}
          else result_player1.won=false;
          match_pool_playerresult[matchid][poolid][nftid_tmp]=result_player1;  
          
      }

  }

  function setpoolinfo(uint256 matchid,uint256 poolid,uint256 winner,uint256 total,uint256 fee)
    public
  {
      poolinfo memory plinfo=poolinfo(poolid,total,0,fee,winner);
      poolid_poolinfo[matchid][poolid]=plinfo;
    
  }
   
function getpoolinfo(uint256 matchid,uint256 poolid)
    public
    view
    returns( poolinfo memory)
  {      
      //poolinfo memory plinfo=poolinfo(poolid,total,0,fee,winner);
      poolinfo memory plinfo=poolid_poolinfo[matchid][poolid];
      return plinfo;
  }

  function resolvewhenmatchcompleted(uint256 matchid,uint256 poolid)
    public
  {
      lookup memory lp =matchid_gameinfo[matchid];
      if(lp.iscompleted==true)
      {
        resolvewinner(matchid,poolid);
        poolinfo memory plinfo=getpoolinfo(matchid,poolid);
        uint fee =plinfo.fee;

        uint256[] memory allplayers=matchid_poolid_playerid[matchid][poolid];
        uint256  length=allplayers.length;
         for(uint256 a=0;a<length;a++)
      {
          uint256 nftid = allplayers[a];
          nftid_info memory lvlup=nftprofile[nftid];
          playerresult memory result_player =match_pool_playerresult[matchid][poolid][nftid];
          if (result_player.won=true)
          {matchid_poolid_nftwinner[matchid][poolid].push(nftid);
          address addr=address_nft[nftid];
          matchid_poolid_nftwinneraddress[matchid][poolid].push(addr);
          lvlup.match_won=lvlup.match_won+1;
          lvlup.profile_level=lvlup.match_won/lvlup.match_lost*2;
          nftprofile[nftid]=lvlup;
          distributeToken(matchid_poolid_nftwinneraddress[matchid][poolid],fee*2);
          }
          else{
            lvlup.match_lost=lvlup.match_lost+1;
            lvlup.profile_level=lvlup.match_won/lvlup.match_lost*2;
            nftprofile[nftid]=lvlup;
          }      
      }


      }


      
    
    

    
  }

  function distributeToken(address[] addresses, uint256 _value) onlyOwner {
     for (uint i = 0; i < addresses.length; i++) {
         balances[owner] -= _value;
         balances[addresses[i]] += _value;
         Transfer(owner, addresses[i], _value);
     }
}
}

  
  


  








  
  




