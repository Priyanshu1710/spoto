import "./App.css";
import SpotoCoinInfo from "./pages/SpotoCoinInfo/SpotoCoinInfo";
import "react-toastify/dist/ReactToastify.css";
import "react-tabs/style/react-tabs.css";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ToastContainer } from "react-toastify";

import useContract from "./utils/hooks/useContract";
import { SPOTO_COIN } from "./utils/contractNamesConstants";
import ManageLiquidity from "./pages/ManageLiquidity/ManageLiquidity";
import Trading from "./pages/Trading/Trading";

const App = () => {
  const spotoCoin = useContract(SPOTO_COIN);

  return (
    <div className="App">
      <h1>Spoto Coin</h1>
      {spotoCoin ? (
        <>
          <Tabs>
            <TabList>
              <Tab>Spoto Coin Info</Tab>
              <Tab>Manage Liquidity</Tab>
              <Tab>Trading</Tab>
            </TabList>

            <TabPanel>
              <SpotoCoinInfo />
            </TabPanel>
            <TabPanel>
              <ManageLiquidity />
            </TabPanel>
            <TabPanel>
              <Trading />
            </TabPanel>
          </Tabs>
          <ToastContainer />
        </>
      ) : (
        "Please connect your wallet to use the dapp!"
      )}
    </div>
  );
};

export default App;
