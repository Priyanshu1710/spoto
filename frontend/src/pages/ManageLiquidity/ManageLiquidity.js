import React, { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddLiquidity from "./AddLiquidity/AddLiquidity";
import { bigNumberToDecimal, callContractMethod } from "../../utils";
import {
  LIQUIDITY_POOL,
  LPT,
  SPOTO_COIN,
  SPOTO_ROUTER,
} from "../../utils/contractNamesConstants";
import useContract from "../../utils/hooks/useContract";
import useMetamaskAccount from "../../utils/hooks/useMetamaskAccount";
import WithdrawLiquidity from "./WithdrawLiquidity/WithdrawLiquidity";
import Loading from "../../components/Loading/Loading";

const ManageLiquidity = () => {
  const lp = useContract(LIQUIDITY_POOL, true);
  const lpToken = useContract(LPT, true);
  const spotoRouter = useContract(SPOTO_ROUTER, true);
  const spotoCoin = useContract(SPOTO_COIN, true);
  const account = useMetamaskAccount();

  const [lpBalance, setLPBalance] = useState(null);
  const [areFundsMoved, setAreFundsMoved] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getFundsMovedOrNot = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      spotoCoin.fundsAlreadyMoved()
    );

    if (error) {
      return toast.error(error);
    }

    setAreFundsMoved(result);
  }, [spotoCoin]);

  const getBalance = useCallback(async () => {
    const { result, error } = await callContractMethod(() =>
      lpToken.balanceOf(account)
    );

    if (error) {
      return toast.error(error);
    }

    setLPBalance(bigNumberToDecimal(result));
  }, [account, lpToken]);

  const getInfo = useCallback(async () => {
    setIsLoading(true);
    if (lp && lpToken && account && spotoCoin && spotoRouter) {
      await getBalance();
      await getFundsMovedOrNot();
    }
    setIsLoading(false);
  }, [
    lp,
    lpToken,
    account,
    spotoCoin,
    spotoRouter,
    getBalance,
    getFundsMovedOrNot,
  ]);

  useEffect(getInfo, [getInfo]);
  useEffect(() => {
    if (lp) {
      const liquidityAdded = lp.filters.LiquidityAdded(account);
      const liquidityRemoved = lp.filters.LiquidityRemoved(account);

      lp.on(liquidityAdded, getInfo);
      lp.on(liquidityRemoved, getInfo);
    }
  }, [account, getInfo, lp]);

  if (areFundsMoved === false) {
    return "Funds haven't been moved to LP yet!";
  }

  return (
    <Loading isLoading={isLoading && lpBalance === null}>
      <div className="liquidity-container">
        {lpBalance === 0 ? (
          <AddLiquidity lpBalance={lpBalance} spotoRouter={spotoRouter} />
        ) : (
          <WithdrawLiquidity lpBalance={lpBalance} spotoRouter={spotoRouter} />
        )}
      </div>
    </Loading>
  );
};

export default ManageLiquidity;
