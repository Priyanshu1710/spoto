import SpotoToken from "../artifacts/contracts/SpotoToken.sol/SpotoToken.json";
import NFTProfile from "../artifacts/contracts/NFTProfile.sol/NFTProfile.json";
import SpotoGame from "../artifacts/contracts/SpotoGame.sol/SpotoGame.json";
import faucet from '../artifacts/contracts/Faucet.sol/faucet.json';
import LiquidityPool from '../artifacts/contracts/liquidity.sol/LiquidityPool.json';
import SPT_LP from '../artifacts/contracts/SPT_LP.sol/SPT_LP.json';
import { BigNumber } from "ethers";
import { ethers } from "ethers";
import Web3Modal from 'web3modal';


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

export const bigNumberToDecimal = (number) => {
  const decimals = BigNumber.from("10000000000000000"); //16 zeroes, the contract has 18 decimals so this would show 2
  const tokens = number.div(decimals).toString();
  return tokens / 100; //Divided by 100 so to move the comma two spaces left
};

export const requestAccount = async () => {

  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return account;
};


export const requestBalance = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const Spotogame = new ethers.Contract(
    contracts.SPOTO_GAME.address,
    contracts.SPOTO_GAME.abi,
    signer
  );

  try {
    const data = await Spotogame.balanceOf(requestAccount());

    const bal = bigNumberToDecimal(data);
    localStorage.setItem("userBal", bal);
  } catch (error) {
    console.log(error);
    window.alert("Please connect Matic Mumbai Testnet");
  }




};

export const callContractMethod = async (method) => {
  let error, result;
  try {
    result = await method();
  } catch (e) {
    error = handleContractCallError(e.error || e);
  }

  return {
    error,
    result,
  };
};

export const handleContractCallError = (error) => {
  let errorReason = error?.message;

  return errorReason;
};

export const handleContractInteractionResponse = async (
  result,
  error,
) => {
  if (error) {
    return error;
  }

  window.success(
    "Transaction sent! Waiting for confirmation from the network..."
  );
  await result.wait();
  window.success("Transaction confirmed!");
};

export const getContractInstance = async (
  contractToGet,
  withSigner = false
) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let contract, signer;

    if (withSigner) {
      await requestAccount();
      signer = getSigner(provider);
    }

    contract = new ethers.Contract(
      contracts[contractToGet].address,
      contracts[contractToGet].abi,
      signer || provider
    );

    return contract;
  }
};

export const getSigner = (provider) => {
  if (window.ethereum) {
    const signer = provider.getSigner();

    return signer;
  }
};

export const truncateString = (string, front, back) => {
  return `${string.substring(0, front)}.....${string.substring(
    string.length - back,
    string.length
  )}`;
}