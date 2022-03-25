import { useEffect, useState } from "react";
import { requestAccount } from "..";

const UseMetamaskAccount = () => {
  const [account, setAccount] = useState(undefined);

  const getAccount = async () => {
    const metamaskAccount = await requestAccount();
    // metamaskAccount = metamaskAccount.JSON();
    console.log(metamaskAccount);
    // metamaskAccount.then((response) => {
    //   console.log(response);
    // });

    setAccount(metamaskAccount);
    // console.log(account);
  };

  useEffect(() => {
    getAccount();
    window.ethereum.on("accountsChanged", getAccount);
    window.ethereum.on("chainChanged", () => window.location.reload());
  }, [getAccount]);

  return account;
};

export default UseMetamaskAccount;
