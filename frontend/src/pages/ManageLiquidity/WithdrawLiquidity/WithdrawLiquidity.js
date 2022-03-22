import React from "react";
import { toast } from "react-toastify";
import {
  callContractMethod,
  handleContractInteractionResponse,
} from "../../../utils";
import "./styles.css";

const WithdrawLiquidity = ({ spotoRouter, lpBalance }) => {
  const withdrawLiquidity = async () => {
    const { result, error } = await callContractMethod(() =>
      spotoRouter.pullLiquidity()
    );

    handleContractInteractionResponse(result, error, toast);
  };

  return (
    <>
      <div className="ownings">
        <strong>You currently own:</strong> {lpBalance} LP Tokens
      </div>
      <button onClick={withdrawLiquidity} className="cool-button">
        Withdraw liquidity
      </button>
    </>
  );
};

export default WithdrawLiquidity;
