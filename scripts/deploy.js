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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
