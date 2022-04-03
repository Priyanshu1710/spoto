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
