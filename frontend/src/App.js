import './App.scss';
import Navbar from './components/Navbar';
import Router from './Router';
import 'antd/dist/antd.css'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setUserAdd, setUserBal } from './actions';
import SpotoToken from "./artifacts/contracts/SpotoToken.sol/SpotoToken.json";
import NFTProfile from "./artifacts/contracts/SpotoToken.sol/SpotoToken.json";
import SpotoGame from "./artifacts/contracts/SpotoGame.sol/SpotoGame.json";
import faucet from './artifacts/contracts/Faucet.sol/faucet.json';
import LiquidityPool from './artifacts/contracts/liquidity.sol/LiquidityPool.json'
import { ethers } from "ethers";
import { BigNumber } from "ethers";
import Web3Modal from 'web3modal';

function App() {
  const [currentPath, setCurrentPath] = useState()
  const location = useLocation();
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.spoto.userAdd);
  const userBal = useSelector((state) => state.spoto.userBal);
  useEffect(() => {
    requestBalance()
    let userAccAdd = localStorage.getItem("userAddresss")
    dispatch(setUserAdd(userAccAdd))
    setCurrentPath(location.pathname)

  }, [])
  const bigNumberToDecimal = (number) => {
    const decimals = BigNumber.from("10000000000000000"); //16 zeroes, the contract has 18 decimals so this would show 2
    const tokens = number.div(decimals).toString();
    return tokens / 100; //Divided by 100 so to move the comma two spaces left
  };
  const requestAccount = async () => {

    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return account;
  };

  const contracts = {
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
      address: "0x34Ee66A1293607f7645C896DCdb8c11b8B48d420",
    }
  };

  const requestBalance = async () => {
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
      dispatch(setUserBal(bal))
    } catch (error) {
      console.log(error);
      window.alert("Please connect Matic Mumbai Testnet");
    }




  };

  return (
    <>
      {/* {(currentPath === '/') ? "" :
        <Navbar />} */}
      {/* <Navbar /> */}
      <Router />
    </>
  );
}

export default App;
