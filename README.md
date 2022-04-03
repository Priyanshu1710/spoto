# Liquidity pool

- Accepts depositing/withdrawing liquidity.
- Mints LP tokens on deposit and burning them on withdrawal.
- Allows swapping ETH/SPT.
- 1% tax for every trade

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
    abi: SpotoCoin.abi,
    address: "0x48eB0799f8F266c2D05586098382f57fCF132015",
  },
  LIQUIDITY_POOL: {
    abi: LiquidityPool.abi,
    address: "0x0511010C236F4372cA6e6201b0855C372B0708b1",
  },
  LPT: {
    abi: LPT.abi,
    address: "0x906697209543137DA9e95CB22618Ac829a2Bce4d",
  },
  SPOTO_ROUTER: {
    abi: SpotoRouter.abi,
    address: "0x37834371D0b7055077ffb5510219C9Ed1Df63D70",
  },
};
```

If you'd like to change that:

- In your env, set `TREASURY_WALLET` to the account that will receive the 2% tax
- Run `npx hardhat run scripts/deploy.js --network matic`
- You'll get the new addresses in your console, change them at `frontend/src/utils/index.js`
