const { hardhatArguments } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const SpotoCoin = await hre.ethers.getContractFactory("SpotoToken");
  const spotoCoin = await SpotoCoin.deploy();
  console.log("Deploying SpotoToken");
  await spotoCoin.deployed();
  console.log("Spoto Token deployed to:", spotoCoin.address);

  const NFT_Profile = await hre.ethers.getContractFactory("NFTProfile");
  const nFT_Profile = await NFT_Profile.deploy();
  console.log("Deploying NFT Profile");
  await nFT_Profile.deployed();
  console.log("NFT Profile deployed to:", nFT_Profile.address);

  const Game = await hre.ethers.getContractFactory("SpotoGame");
  const game = await Game.deploy(
    spotoCoin.address,
    "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
  );
  console.log("Deploying Spoto game");
  await game.deployed();
  console.log("Spoto Game deployed to:", game.address);

  const Faucet = await hre.ethers.getContractFactory("faucet");
  const faucet = await Faucet.deploy(
    spotoCoin.address
  );
  console.log("Deploying Faucet");
  await faucet.deployed();
  console.log("Faucet deployed to:", faucet.address);

  const LpToken = await hre.ethers.getContractFactory("SPT_LP");
  const lptoken = await LpToken.deploy();
  console.log("Deploying LP token");
  await lptoken.deployed();
  console.log("LP token deployed to:", lptoken.address);

  const LiqPool = await hre.ethers.getContractFactory("LiquidityPool");
  const liqPool = await LiqPool.deploy(
    spotoCoin.address,
    10,
    1,
    lptoken.address
  )
  console.log("Deploying Liq pool");
  await liqPool.deployed();
  console.log("Liq Pool deployed to:", liqPool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
