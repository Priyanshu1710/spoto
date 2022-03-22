import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "./styles.css";

import { bigNumberToDecimal, callContractMethod } from "../../utils";

const TokensPurchased = ({ spotoCoin, account }) => {
  const [tokens, setTokens] = useState(null);

  const getTokensAssigned = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.balancesToClaim(account)
    );

    if (error) {
      return toast.error(error);
    }

    const tokens = bigNumberToDecimal(result);
    setTokens(tokens); 
  }, [account, spotoCoin]);

  useEffect(() => {
    getTokensAssigned();
  }, [spotoCoin, account, getTokensAssigned]);

  useEffect(() => {
    const filter = spotoCoin.filters.TokensBought(account);
    spotoCoin.on(filter, () => getTokensAssigned());
  }, [spotoCoin, account, getTokensAssigned]);

  return tokens >= 0 ? (
    <div className="wallet-info">
      <div>
        <strong>Your wallet:</strong> {account}
      </div>
      <div>
        When the token gets to its final phase, you'll get: {tokens}{" "}
        <strong>SPT</strong>
      </div>
    </div>
  ) : (
    "Loading... (Make sure you are on the correct network!)"
  );
};

export default TokensPurchased;
