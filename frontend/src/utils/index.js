import SpotoCoin from "../artifacts/contracts/SpotoCoin.sol/SpotoCoin.json";
import LPT from "../artifacts/contracts/LPT.sol/LPT.json";
import SpotoRouter from "../artifacts/contracts/SpotoRouter.sol/SpotoRouter.json";
import LiquidityPool from "../artifacts/contracts/LiquidityPool.sol/LiquidityPool.json";
import { BigNumber } from "ethers";
import { ethers } from "ethers";

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

export const requestAccount = async () => {
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return account;
};

const mapErrorToFriendlyMessage = (error) => {
  switch (error) {
    case "OWNER_ONLY":
      return "This is meant for the owner! What are you doing here?";
    case "FUNDS_MOVED_TO_LP":
      return "Funds have been already moved to the liquidity pool!";
    case "NOT_LAST_PHASE":
      return "Not at OPEN phase yet!";
    case "NO_AVAILABLE_TOKENS":
      return "Not enough SPT available!";
    case "LAST_PHASE":
      return "Already at last phase!";
    case "CONTRACT_PAUSED":
      return "Contract is paused!";
    case "NOT_ALLOWED":
      return "You don't have permission to contribute!";
    case "User denied transaction":
      return "Transaction denied by user!";
    case "errorSignature=null":
      return "Error getting contract! Are you on the rinkeby network?";
    case "insufficient funds":
      return "Insufficient funds!";
    default:
      return "An error occured calling this method!";
  }
};

const getErrorFromReversion = (revertReason) => {
  console.log(revertReason);
  const revertErrors = [
    "NOT_ALLOWED",
    "OWNER_ONLY",
    "NOT_LAST_PHASE",
    "NO_AVAILABLE_TOKENS",
    "LAST_PHASE",
    "FUNDS_MOVED_TO_LP",
    "CONTRACT_PAUSED",
    "User denied transaction",
    "errorSignature=null",
    "insufficient funds",
  ];

  const error = revertErrors.find((errorConstant) =>
    revertReason.includes(errorConstant)
  );

  return mapErrorToFriendlyMessage(error);
};

export const handleContractCallError = (error) => {
  let errorReason = getErrorFromReversion(error?.message);

  return errorReason;
};

export const handleContractInteractionResponse = async (
  result,
  error,
  toast
) => {
  if (error) {
    return toast.error(error);
  }

  toast.success(
    "Transaction sent! Waiting for confirmation from the network..."
  );
  await result.wait();
  toast.success("Transaction confirmed!");
};

export const bigNumberToDecimal = (number) => {
  const decimals = BigNumber.from("10000000000000000"); //16 zeroes, the contract has 18 decimals so this would show 2
  const tokens = number.div(decimals).toString();
  return tokens / 100; //Divided by 100 so to move the comma two spaces left
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
