import React, { useEffect, useState, useCallback } from "react";
import { callContractMethod } from "../../utils";
import { toast } from "react-toastify";
import useContract from "../../utils/hooks/useContract";
import useMetamaskAccount from "../../utils/hooks/useMetamaskAccount";
import TokensPurchased from "../../components/TokensPurchased/TokensPurchased";
import DepositETH from "../../components/DepositETH/DepositETH";
import PhaseInfo from "../../components/PhaseInfo/PhaseInfo";
import OwnerActions from "../../components/OwnerActions/OwnerActions";
import { SPOTO_COIN } from "../../utils/contractNamesConstants";

const SpotoCoinInfo = () => {
  const [owner, setOwner] = useState(null);
  const spotoCoin = useContract(SPOTO_COIN, true);
  const account = useMetamaskAccount();

  const getOwner = useCallback(async () => {
    const { result, error } = await callContractMethod(spotoCoin.owner);

    if (error) {
      return toast.error(error);
    }

    setOwner(result.toLowerCase());
  }, [spotoCoin]);

  useEffect(() => {
    if (spotoCoin && account) {
      getOwner();
    }
  }, [spotoCoin, account, getOwner]);

  return (
    <div>
      {account && spotoCoin ? (
        <>
          <TokensPurchased spotoCoin={spotoCoin} account={account} />
          <PhaseInfo spotoCoin={spotoCoin} account={account} />
          {account === owner && <OwnerActions spotoCoin={spotoCoin} />}
          <DepositETH spotoCoin={spotoCoin} account={account} />
        </>
      ) : (
        "Updating... (you might need to refresh your browser)"
      )}
    </div>
  );
};

export default SpotoCoinInfo;
