import React, { useState } from 'react'
import { Card } from 'antd';
import './index.scss';
import NavigationBar from '../../components/Navbar';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { contracts } from '../../utils';
import { Link, useNavigate } from 'react-router-dom';


const SelectSport = () => {
    const [redirectPath, setRedirectPath] = useState(false)
    let navigate = useNavigate();

    const approveTx = async () => {

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const Spototoken = new ethers.Contract(
            contracts.SPOTO_COIN.address,
            contracts.SPOTO_COIN.abi,
            signer
        );
        const transaction = await Spototoken.approve(contracts.SPOTO_GAME.address, 10000000000000000000000000n);
        setRedirectPath(true)
        console.log(transaction);
        let tx = await transaction.wait();
        let event = tx.events[0];
        let value = event.args[2];
        console.log(tx)
        if (tx['transactionIndex'] != null) {
            setRedirectPath(false)
            navigate("/liveMatches", { replace: true })

        }
    };


    const { Meta } = Card;
  
    

    const gridStyle = {
        width: '30%',
        textAlign: 'center',
        disply: "flex",
        justifyContent: "space-between"
    };

    return (
        <div className='select_sport_page mt-4 '>
            <div className="bg_container">
                <NavigationBar />
                <div className="dashboard_container">
                    <div className="dashboard_centre_frame_container">
                        <div className="dashboard_centre_frame max_width">
                            <div className="frame_bg">
                                <div className="content_main_container">
                                    <div className="select_sport_container">
                                        {!redirectPath && (

                                            <div className="cards_up_main_heading">
                                                <div className="text">Select Sport</div>
                                            </div>
                                        )}
                                        {redirectPath && (
                                            <>
                                                <h1 className='loading'>Loading Betting Arena...</h1>
                                            </>
                                        )}
                                        {redirectPath === false && (
                                            <>
                                                <Card onClick={approveTx}
                                                    hoverable
                                                    style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                                    cover={<img alt="example" src="https://media.istockphoto.com/photos/football-in-the-sunset-picture-id533861572?b=1&k=20&m=533861572&s=170667a&w=0&h=BnEJndSSxMFdAczWGC_ICPEjYG3ce_hep6maCR8xIF8=" />}
                                                    className='sportPage_card'
                                                >
                                                    <Meta title="Football" />
                                                </Card>
                                            </>
                                        )}
                                    </div>

                                    <div className="coming_soon_cards">
                                        <Card title="Coming Soon">
                                            <div className="cards_container">
                                                <div className="cards">
                                                    <div className="single_cards"><div className="overlay">Cricket</div> </div>
                                                    <div className="single_cards"><div className="overlay">Basketball</div> </div>
                                                </div>
                                            </div>

                                        </Card>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SelectSport;


