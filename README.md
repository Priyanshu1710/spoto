<p align="left">
  <img width="318.978mm" height="97.003448mm" src="https://github.com/Priyanshu1710/spoto/blob/main/src/assets/images/logo.svg">
</p>
# SPOTO

Spoto is a sports betting platform facilitating the users to place bets on live sports. Spoto aims to bridge De-Fi with sports betting and fantasy leagues .

Live App : [Spoto App Devnet](https://spoto-devnet.herokuapp.com/)

## SPOTO Tokonomics

Full document and Tokonomics available :[Spoto Tokonomics ](https://github.com/Priyanshu1710/spoto/blob/main/public/Spoto.pdf)

## Description of Features

- [x]  Liquidity Pool and LP Token
- [x]  NFT Profile
- [x]  Sports betting
- [ ]  Fantasy Sports (Coming soon)
- [ ]  NFT Profile MarketPlace (Coming soon)

## Liquidity Pool and LP token
- Sporto tokens (SPT) are utility tokens used to govern the protocol.
- Users can provide stability to pool(MATIC/SPT) by adding liquidity to it.
- The SPT-LP (ERC-20 Token) is the LP token for MATIC/SPT pool defining their share in the pool.
- SPT-LP will be also accepted as game entry tokens for selected pools/bets with a discounted entry incentivising users to add liquidity to pool. 
- Faucet created to get test SPT Token.


## NFT Profile
- Users will have to select (or create) an NFT profile before entering the gaming arena.
- The NFT profile has the following meta-data characteristics:

| Metadata | Storage |Description|
| ----------- | ----------- |------------------|
| UserName | IPFS |A unique username for the NFT|
| Avatar  | IPFS|2-D profile avatar image|
| Trait   | IPFS| Characteristics of a player|
| Bets Won   | On-Chain| No. of bets won|
| Bets Lost   | On-Chain|No. of Bets lost |
| Profile Level  |On-Chain| Non-decremental profile rating based of bets outcome|

   
- Profile level is dependent upon the overall winning and loosing of bets for an NFT Profile
- Higher the NFT Profile , higher the bet limit can be set by the better.
- SPT Token Airdrop eligible address will be the one having NFT profile qualifying a specific NFT profile level.(Coming Soon)

## Sports Betting
1. Sports available :
 * Football
1. User can create a bet or join an existing bet.
1. User has to match the bet amount while joining the bet.
1. Winning withdrawl can be done post match completion.
1. Profile Level will be altered by the contract upon game completion.

## Data Source
- Rapid-API (For all Football matches )
- Chainlink Oracle (For Match results):
  - Network : Matic Mumbai
  - oracle = 0xc8D925525CA8759812d0c299B90247917d4d4b7C
  - jobId = 7ecb74753e414b54b26ed1b911b88d67


## Technology Stack & Tools
- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- Ant Design(For UI Design)
- [Ether](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (development environment Framework)
- [Ganache](https://www.trufflesuite.com/ganache) (For Local Blockchain)
- [MetaMask](https://metamask.io/) (Ethereum Wallet)
- [Git](https://git-scm.com/)/[GitHub](https://github.com) (Commit our code)
- [Heroku](https://spoto-devnet.herokuapp.com/) (Website Deployment)
- [Chainlink](https://market.link/search/data-providers)(Match Result Outcome)
- [IPFS](https://infura.io/)(For storing NFT metadata to IPFS)

## Network

1. **Network Name**: Polygon Mumbai
    2. **New RPC URL**: https://rpc-mumbai.maticvigil.com/
    3. **Chain ID**: 80001
    4. **Currency Symbol**: MATIC
    5. **Block Explorer URL**: https://mumbai.polygonscan.com/

## Deployed Contracts

| Contract  | Contract Address |Description|
| ----------- | ----------- |------------------|
| SPT Token | 0x164c8D70f19f74b260C16f4701F3A95849E7CafA  |ERC-20 Token address for SPT Token |
| SPT LP Token  | 0xB2297132DA3188Cd3CA85dB7aeA9FC8d82Ea5069|ERC-20 Token address of LP token(MATIC/SPT Pool)|
| Liquidity Pool  | 0x3ca341DCe9C4F10Fe9CB790890aE817eb1d514ac| Factory Contract for liquidity pool|
| NFT Profile   | 0x2E6b7423d003B2749bf80A66E73Dc44dE9D32Ef4 | ERC-721 NFT Profile Contract |
| Sporto Game   | 0x02ABE5f8c645e11cA272b891a3B244a00C9e58bB |Betting base contract |

## Claim SPT Test Token
  - Go to [demo app](https://spoto-devnet.herokuapp.com/)
  - Connect meta-mask with Matic (Mumbai)
  - Import Token with SPT Token Contract address provided below
  - Click on wallet button and click on "Faucet"
  - 10 SPT Token will be transferred to the account in a single transaction.






# Liquidity pool

- Accepts depositing liquidity.
- Mints LP tokens on deposit.

## Running it

You can start the frontend by:

- Add a .env file on the root of the project, and add the field `PRIVATE_KEY`
- Set `PRIVATE_KEY` to your account's private key (so hardhat.config.js knows from which account to deploy)

Then running:

```
npm install
npx hardhat compile (generates the artifacts the frontend will use)
cd frontend
npm install
npm start
```

## Re-deploying

By default the frontend is connected to the deployed version of all the contracts on Matic Mumbai Testnet:

```
export const contracts = {
  SPOTO_COIN: {
    abi: SpotoToken.abi,
    address: "0x164c8D70f19f74b260C16f4701F3A95849E7CafA",
  },
  NFT_PROFILE: {
    abi: NFTProfile.abi,
    address: "0x2E6b7423d003B2749bf80A66E73Dc44dE9D32Ef4",
  },
  SPOTO_GAME: {
    abi: SpotoGame.abi,
    address: "0x02ABE5f8c645e11cA272b891a3B244a00C9e58bB",
  },
  FAUCET: {
    abi: faucet.abi,
    address: "0x73C1A3FA9e721a8214c0747CD301987e0370677e",
  },
  LPT: {
    abi: LiquidityPool.abi,
    address: "0x3ca341DCe9C4F10Fe9CB790890aE817eb1d514ac",
  },
  SPT_LP: {
    abi: SPT_LP.abi,
    address: "0xB2297132DA3188Cd3CA85dB7aeA9FC8d82Ea5069",
  }
};
```

If you'd like to change that:

- Run `npx hardhat run scripts/deploy.js --network matic`
- You'll get the new addresses in your console, change them at `frontend/src/utils/index.js`


## Upcoming Development (v2.0)
  - Deployment on Polygon Mainnet
  - Setup external adapters for fantasy sports data in chainlink
  - NFT based player cards to create teams and market place for such cards based on its NFT value.
  - Multi-token model having SPT token and various LP tokens (Pools with SPT token) as game entry fee
  - AirDrops based on NFT Profile level.
  - Match Making based on profile level
  - Governance for Game related upgradation/changes.




## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
