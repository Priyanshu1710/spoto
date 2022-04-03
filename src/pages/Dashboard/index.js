import React, { useEffect, useState } from 'react'
import './index.scss'
import NavigationBar from '../../components/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardModalState } from '../../actions';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  const dispatch = useDispatch();
  const [accountConnectedStatus, setAccountConnectedStatus] = useState(false)
  const walletAddress = useSelector((state) => state.spoto.userAdd);


  useEffect(() => {
    let fetchWalletAdd = localStorage.getItem('userAddresss');
    setAccountConnectedStatus(fetchWalletAdd)
  }, [accountConnectedStatus])



  return (
    <>
      <div className="bg_container">
        <NavigationBar />
        <div className="dashboard_container">
          <div className="dashboard_centre_frame_container">
            <div className="dashboard_centre_frame max_width">
              <div className="frame_bg">

                <div className="content_main_container">
                  <div className="upper_container">
                    <div className="heading">Invest, Bet and Earn Rewards</div>
                    <div className="paira">A marketplace for all the popular games across the Globe.Come let’s explore this universe. </div>
                  </div>
                  <div className="bottom_container">
                    <div className="btn__main_container">
                      <Link to="/pool"><div className="btn_container"> Add Liquidity</div> </Link> <br />
                      <Link to="/selectProfile"><div className="btn_container">Create NTF</div></Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Dashboard
