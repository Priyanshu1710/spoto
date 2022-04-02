
import React, { useState } from 'react';
import NavigationBar from '../../components/Navbar'
import { useDispatch } from 'react-redux';
import { setDashboardModalState } from '../../actions';
import '../ProfilePage/index.scss'
import './index.scss';


const LiquidityPage = () => {
    const dispatch = useDispatch();
    const [eth, setEth] = useState("");
    const [matic, setMatic] = useState("");

    function onEthChange(e) {
        setEth(e);

    }
    function onMaticChange(e) {
        setMatic(e);
    }


    return (
        <div className="liquidity_pool">

            <div className="bg_container">
                <NavigationBar />
                <div className="dashboard_container">
                    <div className="dashboard_centre_frame_container">
                        <div className="dashboard_centre_frame max_width">
                            <div className="frame_bg">
                                <div className="content_main_container">
                                    <div className="cards_up_main_heading">
                                        <div className="text">Add Liquidity to Pool</div>
                                    </div>
                                    <div className="pool_main_container">
                                        <div className="detail_container">
                                            <div className="input_container">
                                                <label htmlFor="ETHtoken">Matic Token :</label> <br />
                                                <input type="number" name="ETHtoken" id="ETHtoken" value={eth} onChange={event => onEthChange(event.target.value)} />  <span className='token_name'>Matic</span>
                                                <div className='plus_symbol'>+</div>
                                                <label htmlFor="Matictoken">SPT Token :</label> <br />
                                                <input type="number" name="Matictoken" id="Matictoken" value={matic} onChange={event => onMaticChange(event.target.value)} /><span className='token_name'>SPT</span>
                                            </div>
                                        </div>
                                        <div className="button">
                                            <div className="btn_container" onClick={() => {

                                            }}><span>Add Liquidity</span> </div>
                                        </div>
                                        <div className="pool_cards_container">
                                            <div className="pool_cards">
                                                <div className="head">My LP Shares</div>
                                                <div className="value">231</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default LiquidityPage;