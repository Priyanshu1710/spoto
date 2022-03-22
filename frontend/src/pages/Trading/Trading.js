import React, { useCallback, useEffect, useState } from "react";
import {
  LIQUIDITY_POOL,
  SPOTO_COIN,
  SPOTO_ROUTER,
} from "../../utils/contractNamesConstants";
import Loading from "../../components/Loading/Loading";
import useContract from "../../utils/hooks/useContract";
import "./styles.css";
import {
  bigNumberToDecimal,
  callContractMethod,
  handleContractInteractionResponse,
} from "../../utils";
import { toast } from "react-toastify";
import { parseEther } from "ethers/lib/utils";

const Trading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [inputAmount, setInputAmount] = useState("");
  const [inputToken, setInputToken] = useState("ETH");
  const [areFundsMoved, setAreFundsMoved] = useState();

  const [ethReserve, setEthReserve] = useState("");
  const [sptReserve, setSptReserve] = useState("");

  const spotoRouter = useContract(SPOTO_ROUTER, true);
  const spotoCoin = useContract(SPOTO_COIN, true);
  const lp = useContract(LIQUIDITY_POOL, true);

  const handleInputChange = (eventValue) => {
    const value = eventValue
      .replace(/[^.\d]/g, "")
      .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");

    setInputAmount(value);
  };

  const switchInput = () => {
    setInputToken((prevState) => (prevState === "ETH" ? "SPT" : "ETH"));
  };

  const swapTokens = async () => {
    const methodToCall = () =>
      inputToken === "ETH"
        ? spotoRouter.swapTokens(0, { value: parseEther(inputAmount) })
        : spotoRouter.swapTokens(parseEther(inputAmount));

    const { result, error } = await callContractMethod(methodToCall);

    if (error) {
      return toast.error(error);
    }

    handleContractInteractionResponse(result, error, toast);
  };

  const getCurrentReserves = useCallback(async () => {
    const { result, error } = await callContractMethod(() => lp.getReserves());

    if (error) {
      return toast.error(error);
    }

    const reserves = result.map((reserve) => bigNumberToDecimal(reserve));
    setEthReserve(reserves[0]);
    setSptReserve(reserves[1]);
  }, [lp]);

  const getFundsMovedOrNot = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.fundsAlreadyMoved()
    );

    if (error) {
      return toast.error(error);
    }

    setAreFundsMoved(result);
  }, [spotoCoin]);

  const getApproximateTradedAmount = () => {
    const product = ethReserve * sptReserve;

    let amountToGet;
    if (inputToken === "ETH") {
      const y = product / (ethReserve + parseFloat(inputAmount));

      amountToGet = sptReserve - y;
    } else {
      const x = product / (sptReserve + parseFloat(inputAmount));
      amountToGet = ethReserve - x;
    }
    return amountToGet.toFixed(2);
  };

  useEffect(() => {
    if (spotoRouter && lp && spotoCoin) {
      getCurrentReserves();
      getFundsMovedOrNot();
      setIsLoading(false);
    }
  }, [spotoRouter, lp, spotoCoin, getCurrentReserves, getFundsMovedOrNot]);

  if (areFundsMoved === false) {
    return "Funds haven't been moved to LP yet!";
  }

  return (
    <Loading isLoading={isLoading}>
      <div className="container">
        ETH reserves: {ethReserve}
        <br />
        <br />
        SPT reserves: {sptReserve}
        <div className="input-container">
          <input
            type="text"
            value={inputAmount}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`${inputToken} amount...`}
            className="lp-input"
          />
          {inputToken}
        </div>
        <button onClick={swapTokens} className="cool-button">
          Trade {inputToken} for {inputToken === "ETH" ? "SPT" : "ETH"}
        </button>
        {inputAmount && (
          <p>
            You'll get around {getApproximateTradedAmount()}{" "}
            {inputToken === "ETH" ? "SPT" : "ETH"}
          </p>
        )}
        <p className="switch-input" onClick={switchInput}>
          I want to give {inputToken === "ETH" ? "SPT" : "ETH"} instead!
        </p>
      </div>
    </Loading>
  );
};

export default Trading;
