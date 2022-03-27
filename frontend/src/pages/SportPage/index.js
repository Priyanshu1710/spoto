import React from 'react'
import { Card } from 'antd';
import './index.scss';
import NavigationBar from '../../components/Navbar';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { contracts } from '../../utils';
import { Link } from 'react-router-dom';


const SelectSport = () => {

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
        const transaction = await Spototoken.approve(contracts.SPOTO_GAME.address, 100000000);
        console.log(transaction);
        let tx = await transaction.wait();
        let event = tx.events[0];
        let value = event.args[2];
        console.log(tx)
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
                                        <Link to="/liveMatches">  <Card
                                            hoverable
                                            style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                            cover={<img alt="example" src="https://media.istockphoto.com/photos/football-in-the-sunset-picture-id533861572?b=1&k=20&m=533861572&s=170667a&w=0&h=BnEJndSSxMFdAczWGC_ICPEjYG3ce_hep6maCR8xIF8=" />}
                                            className='sportPage_card'
                                        >
                                            <Meta title="Football" />
                                        </Card>
                                        </Link>
                                        {/* <Card
                                            hoverable
                                            style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                            cover={<img alt="example" src="https://wallpaperaccess.com/full/1088597.jpg" />}
                                            className='sportPage_card'
                                        >
                                            <Meta title="Cricket" />
                                        </Card> */}
                                    </div>

                                    <button onClick={approveTx}>Approve</button>

                                    <div className="coming_soon_cards">
                                        <Card title="Coming Soon">
                                            <Card.Grid style={gridStyle}>Cricket</Card.Grid>
                                            <Card.Grid style={gridStyle}>Basketball</Card.Grid>
                                            {/* <Card.Grid style={gridStyle}>Game 3</Card.Grid> */}

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


