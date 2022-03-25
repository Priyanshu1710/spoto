import React, { useEffect, useState } from 'react'
import './index.scss'
import NavigationBar from '../../components/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardModalState } from '../../actions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [accountConnectedStatus, setAccountConnectedStatus] = useState(false)
  const walletAddress = useSelector((state) => state.spoto.userAdd);



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
                      <div className="btn_container"
                        onClick={(() => {
                          dispatch(setDashboardModalState(true))

                        })}
                      > {walletAddress ? " Connected" : "Connect Wallet"}</div> <br />
                      <div className="btn_container">Explore Now</div>
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
