import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import {
  callContractMethod,
  contracts,
  handleContractInteractionResponse,
} from "../../utils";
import "./styles.css";

const OwnerActions = ({ spotoCoin }) => {
  const [areFundsMoved, setAreFundsMoved] = useState();

  const getFundsMovedOrNot = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.fundsAlreadyMoved()
    );

    if (error) {
      return toast.error(error);
    }

    setAreFundsMoved(result);
  }, [spotoCoin]);

  useEffect(() => {
    getFundsMovedOrNot();
    spotoCoin.on("FundsMoved", getFundsMovedOrNot);
  }, [spotoCoin, getFundsMovedOrNot]);

  const advancePhase = async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.advancePhase()
    );

    handleContractInteractionResponse(result, error, toast);
  };

  const moveFunds = async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.sendLiquidityToLPContract(contracts.LIQUIDITY_POOL.address)
    );

    handleContractInteractionResponse(result, error, toast);
  };

  const toggleTax = async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.toggleTax()
    );

    handleContractInteractionResponse(result, error, toast);
  };

  const togglePause = async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.togglePauseContract()
    );

    handleContractInteractionResponse(result, error, toast);
  };

  return (
    <div className="owner-container">
      <h1>Owner</h1>
      <button className="cool-button" onClick={advancePhase}>
        Advance phase
      </button>
      <button className="cool-button toggle-tax" onClick={toggleTax}>
        Toggle tax
      </button>
      <button className="cool-button toggle-tax" onClick={togglePause}>
        Toggle pause
      </button>
      {!areFundsMoved && (
        <button className="cool-button toggle-tax" onClick={moveFunds}>
          Move funds to LP
        </button>
      )}
    </div>
  );
};

export default OwnerActions;
