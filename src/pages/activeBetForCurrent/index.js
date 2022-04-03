import React, { useEffect, useState } from 'react'
import '../activeBet/index.scss';
import './index.scss'
import NavigationBar from '../../components/Navbar'
import { Tabs } from 'antd';
import { Table } from 'antd';
import { Modal } from 'antd';
import { Select } from 'antd';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import Web3Modal from 'web3modal';
import { useSelector, useDispatch } from 'react-redux';
import { contracts } from '../../utils';
import betLogo from '../../assets/images/football-team.jpeg'

const LiveActiveBet = () => {
    const nftId = useSelector((state) => state.spoto.selectedUserhex);
    const matchID = useSelector((state) => state.spoto.currentFixtureIdUpcomingMatches);
    const nftIdFLocal = localStorage.getItem("userhex")
    const [betAmt, setbetAmt] = useState();
    const [joinAmt, setjoinAmt] = useState();
    const [userBetAmnt, setUserBetAmnt] = useState();
    const [userTeam, setUserTeam] = useState();

    const { TabPane } = Tabs;
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isPlaceBetModalVisible, setIsPlaceBetModalVisible] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState();
    const [BetId, setBetId] = useState();
    const [activebet, setActiveBet] = useState([]);
    const [ourBetData, setOurBetData] = useState([]);


    const createbet = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const Spotogame = new ethers.Contract(
            contracts.SPOTO_GAME.address,
            contracts.SPOTO_GAME.abi,
            signer
        );
        const transaction = await Spotogame.createBet(matchID, selectedTeam, localStorage.getItem("userhex"), betAmt);
        console.log(transaction);
        let tx = await transaction.wait();
        console.log(tx)

    };

    const showbet = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const Spotogame = new ethers.Contract(
            contracts.SPOTO_GAME.address,
            contracts.SPOTO_GAME.abi,
            signer
        );

        const queryBets = await Spotogame.getActiveBets();
        setActiveBet(queryBets)
        let ourBetFilterData = queryBets.filter(data => data['nftid_player1'] == nftIdFLocal || data['nftid_player2'] == nftIdFLocal);

        setOurBetData(ourBetFilterData)

    };

    const placebet = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const Spotogame = new ethers.Contract(
            contracts.SPOTO_GAME.address,
            contracts.SPOTO_GAME.abi,
            signer
        );

        const transaction = await Spotogame.joinBet(BetId, selectedTeam, localStorage.getItem("userhex"), userBetAmnt);
        console.log(transaction);
        let tx = await transaction.wait();
        console.log(tx)

    }

    const OurBetcolumns = [
        {
            title: 'Player 1 Bet',
            dataIndex: 'home',
            width: 180,

        },
        {
            title: '',
            dataIndex: 'vs',
            width: 100,


        },
        {
            title: 'Player 2 Bet',
            dataIndex: 'away',
            width: 250,

        },
        // {
        //     title: '',
        //     dataIndex: 'address',
        //     width: 150,
        // },
    ];
    const columns = [
        {
            title: 'Player 1 Bet',
            dataIndex: 'home',
            width: 180,

        },
        {
            title: '',
            dataIndex: 'vs',
            width: 100,


        },
        {
            title: 'Player 2 Bet',
            dataIndex: 'away',
            width: 150,
            style: {
                textAlign: "left",

            }

        },
        // {
        //     title: '',
        //     dataIndex: 'age',
        //     width: 120,
        // },
        // {
        //     title: '',
        //     dataIndex: 'address',
        //     width: 150,
        // },
    ];

    const { Option } = Select;

    function handleChange(value) {
        setSelectedTeam(value);
    }
    function placeBetHandleChange(value) {
        setSelectedTeam(value);
    }

    const showModal = () => {
        setIsCreateModalVisible(true);
    };
    const placeBetShowModal = () => {
        setIsPlaceBetModalVisible(true);
    };

    const handleOk = () => {
        createbet();
        setIsCreateModalVisible(false);
    };
    const placeBetHandleOk = () => {
        placebet();
        setIsPlaceBetModalVisible(false);
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
    };
    const placeBetHandleCancel = () => {
        setIsPlaceBetModalVisible(false);
    };



    function callback(key) {
        console.log(key);
    }

    useEffect(() => {
        fetchLiveMatchData()
        showbet()
    }, [])






    //live matches *******************
    function fetchLiveMatchData() {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                'X-RapidAPI-Key': 'c3b03416cfmshc81e3e32d4e66c4p1b6d9fjsnf9fbc9d9d530'
            }
        };
        // 'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all'
        fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all', options)
            .then(response => response.json())
            .then(response => {
                let data = response.response;
                // console.log(response);
                setLiveMatchesData(data);
            })
            .catch(err => console.error(err));
    }

    function setOpentTeam(data) {
        if (data == 0) {
            setUserTeam("Away Team")
            return
        }
        if (data == 1) {
            setUserTeam("Home Team")
            return
        }
    }



    const prevMatches = [];
    const liveMatches = [];
    const ourBet = [];
    const [prevMatchesData, setPrevMatchesData] = useState([]);
    const [liveMatchesData, setLiveMatchesData] = useState([]);

    const [upcomingMatchesData, setUpcomingMatchesData] = useState([]);
    const upcomingMatches = [];

    //Our Bet Data 
    for (let i = ourBetData?.length - 1; i >= 0; i--) {

        ourBet.push({
            key: ourBetData[i]['bettingPairId']['_hex'],
            home:
                <div className='home_team_main_container'>
                    <div className="icon_container">
                        <img src={betLogo} alt="@error" />
                    </div>
                    <div className="name_container">{ourBetData[i] && ourBetData[i]['nftid_player1']}</div>
                    <div className="deposite">{parseInt(ourBetData[i] && ourBetData[i]['player1Deposit']?._hex).toString().slice(0, -18)} SPT</div>
                    <div className="predection"> {parseInt(ourBetData[i]['player1GamePrediction']._hex) === 0 ? "Home Team" : "Away Team"}</div>
                </div>
            ,
            vs: <div>v/s</div>,
            away: <div className='home_team_main_container away_team_main_container our_bet_main_container'>
                <div className="name_container">{ourBetData[i]['nftid_player2'] || "-"}</div>
                <div className="deposite">{parseInt(ourBetData[i]['player2Deposit']?._hex).toString().slice(0, -18) || "-"} SPT</div>
                <div className="predection"> {parseInt(ourBetData[i]['player2GamePrediction']?._hex) === 0 ? ourBetData[i]['nftid_player2'] ? "Home team" : "-----" : "Away Team"}</div>
                <div className="icon_container">
                    <img src={betLogo} alt="@error" />
                </div>
            </div>,

        });
    }
    //Active Matches Data 
    for (let i = activebet?.length - 1; i >= 0; i--) {

        liveMatches.push({
            key: activebet[i]['bettingPairId']['_hex'],
            home:
                <div className='home_team_main_container'>
                    <div className="icon_container">
                        <img src={betLogo} alt="@error" />
                    </div>
                    <div className="name_container">{activebet[i]['nftid_player1']}</div>
                    <div className="deposite">{parseInt(activebet[i]['player1Deposit']?._hex).toString().slice(0, -18)} SPT</div>
                    <div className="predection"> {parseInt(activebet[i]['player1GamePrediction']._hex) === 0 ? "Home Team" : "Away Team"}</div>
                </div>
            ,
            vs: <div>v/s</div>,
            away: <div className='home_team_main_container away_team_main_container'>
                <div className="name_container">{activebet[i]['nftid_player2'] || "-"}</div>
                <div className="deposite">{parseInt(activebet[i]['player2Deposit']?._hex).toString().slice(0, -18) || "-"} SPT</div>
                <div className="predection"> {parseInt(activebet[i]['player2GamePrediction']?._hex) === 0 ? activebet[i]['nftid_player2'] ? "Home team" : "-----" : "Away Team"}</div>
                <div className="icon_container">
                    <img src={betLogo} alt="@error" />
                </div>
            </div>,
            // age:
            //     <div className="bet_btn_container">
            //         <div className="btn_primary" onClick={(() => {
            //             placeBetShowModal()
            //             setBetId(activebet[i]['bettingPairId']['_hex'])
            //             setUserBetAmnt(parseInt(activebet[i]['player1Deposit']?._hex).toString().slice(0, -18))
            //             setOpentTeam(parseInt(activebet[i]['player1GamePrediction']._hex))
            //         })} >Bet</div>
            //     </div>,
        });
    }

    return (
        <>
            <div className="">
                <div className="match_cards_conntainer  bet_cards_conntainer live_match_active_bet_cards">
                    <div className="bg_container">
                        <NavigationBar />
                        <div className="dashboard_container">
                            <div className="dashboard_centre_frame_container">
                                <div className="dashboard_centre_frame max_width">
                                    <div className="frame_bg">
                                        <div className="content_main_container">
                                            <div className="live_matches_main_container active_bet_main_container">
                                                <Tabs defaultActiveKey="1" onChange={callback} className='live_matches_tabs bet_matches_tabs'>

                                                    <TabPane tab="Active Bets" key="1" style={{ color: "white", textAlign: "left" }} className='our_bet_table'>

                                                        {!loading && (
                                                            <>
                                                                <Table
                                                                    columns={columns}
                                                                    dataSource={liveMatches}
                                                                    pagination={{ pageSize: 30 }}
                                                                    scroll={{ y: 378 }}
                                                                    pagination={false}
                                                                />
                                                            </>
                                                        )}
                                                        {loading && (<h1 className='loading'>Loading...</h1>)}
                                                    </TabPane>

                                                    <TabPane tab="My Bets" key="0" style={{ color: "white", textAlign: "left" }}>

                                                        {!loading && (
                                                            <>
                                                                <Table
                                                                    columns={OurBetcolumns}
                                                                    dataSource={ourBet}
                                                                    pagination={{ pageSize: 30 }}
                                                                    scroll={{ y: 378 }}
                                                                    pagination={false}
                                                                />
                                                            </>
                                                        )}
                                                        {loading && (<h1 className='loading'>Loading...</h1>)}
                                                    </TabPane>



                                                </Tabs>
                                            </div>
                                            <div className="create_bet_main_container">
                                                <Link to="/liveMatches">
                                                    <div className="button arrow_button" type="primary" >
                                                        <span className='arrow'> &#x2190;</span>
                                                        <span className='text'> Live Matches</span>
                                                    </div>
                                                </Link>

                                                <div className="make_bet_main_container" type="primary">
                                                    <Modal
                                                        title="Place Bet"
                                                        visible={isPlaceBetModalVisible}
                                                        onOk={placeBetHandleOk}
                                                        centered={true}
                                                        footer={false}
                                                        onCancel={placeBetHandleCancel}
                                                        style={{
                                                            height: 295,
                                                        }}
                                                        className="create_bet_modal_container"
                                                    >
                                                        <div className="create_bet_modal_container_inside">
                                                            <Select defaultValue="Select Team" style={{ width: 350, border: '2px solid #ce18c5', color: "white", borderRadius: "5px" }} onChange={placeBetHandleChange}>
                                                                <Option value="0" disabled={userTeam === "Home Team" ? false : true}>Home Team</Option>
                                                                <Option value="1" disabled={userTeam === "Away Team" ? false : true}>Away Team</Option>
                                                                <Option value="2">Draw</Option>
                                                            </Select>
                                                            <div className="input_box">
                                                                <input type="number" placeholder='Enter bet amount' value={userBetAmnt} disabled />
                                                            </div>
                                                            <div className="button" onClick={(() => placeBetHandleOk())}>Place Bet</div>

                                                        </div>
                                                    </Modal>
                                                </div>

                                            </div>




                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div></>
    )
}

export default LiveActiveBet;