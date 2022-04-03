import { useEffect, useState } from "react";
import { requestAccount } from "..";

const UseMetamaskAccount = () => {
  const [account, setAccount] = useState(undefined);

  const getAccount = async () => {
    const metamaskAccount = await requestAccount();

    setAccount(metamaskAccount);
  };

  useEffect(() => {
    getAccount();
    window.ethereum.on("accountsChanged", getAccount);
    window.ethereum.on("chainChanged", () => window.location.reload());
  }, [getAccount]);

  return account;
};

export default UseMetamaskAccount;
