const { hardhatArguments } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const SpotoCoin = await hre.ethers.getContractFactory("SpotoCoin");
  const spotoCoin = await SpotoCoin.deploy(
    hardhatArguments.network === "localhost"
      ? "0x4375e26d32dC497917e95Ba7c223801Ddf8174e6"
      : process.env.TREASURY_WALLET
  );
  console.log("Deploying SpotoCoin");
  await spotoCoin.deployed();
  console.log("Spoto Coin deployed to:", spotoCoin.address);

  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const liquidityPool = await LiquidityPool.deploy();
  console.log("Deploying LiquidityPool");
  await liquidityPool.deployed();
  console.log("Liquidity Pool deployed to:", liquidityPool.address);

  const LPT = await hre.ethers.getContractFactory("LPT");
  const lpt = await LPT.deploy(liquidityPool.address);
  console.log("Deploying LPT");
  await lpt.deployed();
  console.log("LPT deployed to:", lpt.address);

  await liquidityPool.setSpotoCoinAddress(spotoCoin.address);
  await liquidityPool.setLPTAddress(lpt.address);

  const SpotoRouter = await hre.ethers.getContractFactory("SpotoRouter");
  const spotoRouter = await SpotoRouter.deploy(
    liquidityPool.address,
    spotoCoin.address
  );
  console.log("Deploying SpotoRouter");
  await spotoRouter.deployed();
  console.log("Spoto Router deployed to:", spotoRouter.address);

  await spotoCoin.setRouterAddress(spotoRouter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
