import { parseEther } from "ethers/lib/utils";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  callContractMethod,
  handleContractInteractionResponse,
} from "../../../utils";
import "./styles.css";

const AddLiquidity = ({ spotoRouter }) => {
  const [allowCustomAmounts, setAllowCustomAmounts] = useState(true);
  const [ethAmount, setEthAmount] = useState("");
  const [sptAmount, setSptAmount] = useState("");

  const handleInputChange = (token, eventValue) => {
    const value = eventValue
      .replace(/[^.\d]/g, "")
      .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");

    if (token === "eth") {
      setEthAmount(value);
      if (allowCustomAmounts) setSptAmount(value * 5);
    } else if (token === "spt") {
      setSptAmount(value);
      if (allowCustomAmounts) setEthAmount(value / 5);
    }
  };

  const depositLiquidity = async () => {
    const { result, error } = await callContractMethod(() =>
      spotoRouter.addLiquidity(parseEther(sptAmount.toString()), {
        value: parseEther(ethAmount.toString()),
      })
    );

    handleContractInteractionResponse(result, error, toast);
  };

  const handleCheckboxClick = () => {
    setAllowCustomAmounts((prevState) => !prevState);
    if (!allowCustomAmounts) setSptAmount(ethAmount * 5);
  };

  return (
    <div>
      <div className="input-amounts">
        <div className="input-container">
          <input
            type="text"
            value={ethAmount}
            onChange={(e) => handleInputChange("eth", e.target.value)}
            placeholder="ETH amount..."
            className="lp-input"
          />
          ETH
        </div>
        <div className="input-container">
          <input
            type="text"
            value={sptAmount}
            placeholder="SPT amount..."
            onChange={(e) => handleInputChange("spt", e.target.value)}
            className="lp-input"
          />
          SPT
        </div>
        <div className="assist-container">
          <label>
            <input
              type="checkbox"
              name="assist-on"
              value={allowCustomAmounts}
              onChange={handleCheckboxClick}
            />{" "}
            Allow custom amounts
          </label>
        </div>
      </div>
      {ethAmount && sptAmount ? (
        <button onClick={depositLiquidity} className="cool-button">
          Add liquidity
        </button>
      ) : null}
    </div>
  );
};

export default AddLiquidity;
