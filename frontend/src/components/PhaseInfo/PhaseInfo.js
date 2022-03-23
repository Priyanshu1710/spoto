import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { bigNumberToDecimal,contracts,handleContractInteractionResponse, callContractMethod } from "../../utils";
import "./styles.css";

const PhaseInfo = ({ spotoCoin, account }) => {

  const moveFunds = async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.sendLiquidityToLPContract(contracts.LIQUIDITY_POOL.address)
    );

    handleContractInteractionResponse(result, error, toast);
  };
  const [totalContributed, setTotalContributed] = useState();
  const [isTaxOn, setIsTaxOn] = useState();
  const [isPaused, setIsPaused] = useState();

  const getTotalContributed = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.totalContributed()
    );

    if (error) {
      return toast.error(error);
    }

    const totalContributedDecimal = bigNumberToDecimal(result);
    setTotalContributed(totalContributedDecimal);
  }, [spotoCoin]);

  const getTaxOnOrOff = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.isTaxOn()
    );

    if (error) {
      return toast.error(error);
    }

    setIsTaxOn(result);
  }, [spotoCoin]);

  const getPausedOrNot = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.isContractPaused()
    );

    if (error) {
      return toast.error(error);
    }

    setIsPaused(result);
  }, [spotoCoin]);

  const getPhaseInfo = useCallback(() => {
    // getPhase();
    getTotalContributed();
    getTaxOnOrOff();
    getPausedOrNot();
  }, [getTotalContributed, getTaxOnOrOff, getPausedOrNot]);

  useEffect(() => {
    getPhaseInfo();
  }, [getPhaseInfo]);

  useEffect(() => {
    spotoCoin.on("TokensBought", getPhaseInfo);
    spotoCoin.on("OwnerAction", getPhaseInfo);
  }, [spotoCoin, getPhaseInfo]);

  return totalContributed >= 0 ? (
    <div className="phase-info-container">
      <div className="info-row">
        <span className="key">Overall raised funds:</span>
        <span className="value">{totalContributed} ETH</span>
      </div>
      <div className="info-row">
        <span className="key">Tax:</span>
        <span className="value">{isTaxOn ? "ON" : "OFF"}</span>
      </div>
      <div className="info-row">
        <span className="key">Paused:</span>
        <span className="value">{isPaused ? "YES" : "NO"}</span>
      </div>
      <div className="info-row">
      <button className="cool-button toggle-tax" onClick={moveFunds}>
          Move funds to LP
      </button>
      </div>
    </div>
  ) : (
    "Getting extra info..."
  );
};

export default PhaseInfo;
