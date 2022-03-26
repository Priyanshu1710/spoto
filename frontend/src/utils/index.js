import SpotoToken from "../artifacts/contracts/SpotoToken.sol/SpotoToken.json";
import NFTProfile from "../artifacts/contracts/NFTProfile.sol/NFTProfile.json";
import SpotoGame from "../artifacts/contracts/SpotoGame.sol/SpotoGame.json";
import { ethers } from "ethers";

export const contracts = {
  SPOTO_COIN: {
    abi: SpotoToken.abi,
    address: "0xf8c329E0880D7ca3E8c44Ee048E17cBc833d5139",
  },
  NFT_PROFILE: {
    abi: NFTProfile.abi,
    address: "0xd748fbB76854CFC4Bbbc2BffC984581397c7fB5d",
  },
  SPOTO_GAME: {
    abi: SpotoGame.abi,
    address: "0xd8F4015D6aA40a6d1abF0910B78c40FB9886160d",
  },
};

export const requestAccount = async () => {
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return account;
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
