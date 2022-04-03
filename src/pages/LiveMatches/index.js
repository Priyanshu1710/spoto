import React, { useEffect, useState } from 'react'
import { Card } from 'antd';
import NavigationBar from '../../components/Navbar'
import './index.scss';
import { Tabs } from 'antd';
import { Table } from 'antd';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUpcomingMatchFixtureId } from '../../actions';


const LiveMatches = () => {
    const { TabPane } = Tabs;
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const columns = [
        {
            title: 'Home Team',
            dataIndex: 'name',
            // width: 150,

        },
        {
            title: '',
            dataIndex: 'age',
            width: 150,
        },
        {
            title: 'Away Team',
            dataIndex: 'address',
        },
    ];



    function callback(key) {
        console.log(key);
    }

    useEffect(() => {
        fetchPrevMatchData()
        fetchLiveMatchData()
        fetchUpcomingMatchesData()
    }, [])


    // prev matches ********************
    function fetchPrevMatchData() {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                'X-RapidAPI-Key': 'c3b03416cfmshc81e3e32d4e66c4p1b6d9fjsnf9fbc9d9d530'
            }
        };
        // "https://api-football-v1.p.rapidapi.com/v3/fixtures?last=20"
        fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?last=20', options)
            .then(response => response.json())
            .then(response => {
                // console.log("Prev data--->", response);
                let data = response.response;
                setPrevMatchesData(data)

            })

            .catch(err => console.error(err));
    }



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
                setLiveMatchesData(data);
            })
            .catch(err => console.error(err));
    }



    //fixure id ***************
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    //         'X-RapidAPI-Key': 'c3b03416cfmshc81e3e32d4e66c4p1b6d9fjsnf9fbc9d9d530'
    //     }
    // };

    // fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?id=157201', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));


    //upcomming matches ***************
    function fetchUpcomingMatchesData() {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                'X-RapidAPI-Key': 'c3b03416cfmshc81e3e32d4e66c4p1b6d9fjsnf9fbc9d9d530'
            }
        };
        // https://api-football-v1.p.rapidapi.com/v3/fixtures?next=20
        fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?next=20', options)
            .then(response => response.json())
            .then(response => {
                let data = response.response;
                // console.log("Upcoming data--->", response);
                setUpcomingMatchesData(data);
            })
            .catch(err => console.error(err));
    }

    function convertUSTdateinIST(input) {
        let newInput = input;
        newInput = newInput.toString();
        let newDate = new Date(newInput).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' }) + " IST";
        return newDate;
    }

    const prevMatches = [];
    const liveMatches = [];
    const [prevMatchesData, setPrevMatchesData] = useState([]);
    const [liveMatchesData, setLiveMatchesData] = useState([]);
    const [upcomingMatchesData, setUpcomingMatchesData] = useState([]);
    const upcomingMatches = [];

    // Prev Matches Data
    for (let i = 0; i < prevMatchesData?.length; i++) {
        prevMatches.push({
            key: i,
            name:
                <div className='home_team_main_container'>
                    <div className="icon_container">
                        <img src={prevMatchesData[i]?.teams?.home?.logo} alt={prevMatchesData[i]?.teams?.home?.name} />
                    </div>
                    <div className="name_container">{prevMatchesData[i]?.teams?.home?.name}</div>
                </div>
            ,
            age:
                <div className="vs_main_container">
                    <div className="leauge_container">{prevMatchesData[i]?.league?.name}</div>
                    <div className="vs_container">V/S</div>
                    {/* <div className="time_container"><span className='winnner'>{(prevMatchesData[i]?.fixture?.status?.long === "Not Started") ? "0" : prevMatchesData[i]?.goals?.home}</span> - <span className='looser'>{prevMatchesData[i]?.goals?.away}</span></div> */}
                    <div className="time_container"><span className={(prevMatchesData[i]?.teams?.home?.winner) ? ((prevMatchesData[i]?.teams?.home?.winner === prevMatchesData[i]?.teams?.away?.winner) ? "draw" : "winner") : "looser"}>{(prevMatchesData[i]?.goals?.home === null) ? <span className='matche_cancle'>Match </span> : prevMatchesData[i]?.goals?.home}</span>{(prevMatchesData[i]?.goals?.home === null) ? "" : "-"}  <span className={(prevMatchesData[i]?.teams?.away?.winner) ? ((prevMatchesData[i]?.teams?.home?.winner === prevMatchesData[i]?.teams?.away?.winner) ? "draw" : "winner") : "looser"}>{(prevMatchesData[i]?.goals?.home === null) ? <span className='matche_cancle'>Abatement</span> : prevMatchesData[i]?.goals?.away}</span></div>
                </div >,
            address:
                <div className='home_team_main_container away_team_main_container'>
                    <div className="name_container">{prevMatchesData[i]?.teams?.away?.name}</div>
                    <div className="icon_container">
                        <img src={prevMatchesData[i]?.teams?.away?.logo} alt={prevMatchesData[i]?.teams?.away?.name} />
                    </div>
                </div>,
        });
    }
    // Live Matches Data 
    for (let i = 0; i < liveMatchesData?.length; i++) {
        liveMatches.push({
            key: liveMatchesData[i]?.fixture?.id,
            name:
                <div className='home_team_main_container'>
                    <div className="icon_container">
                        <img src={liveMatchesData[i]?.teams?.home?.logo} alt={liveMatchesData[i]?.teams?.home?.name} />
                    </div>
                    <div className="name_container">{liveMatchesData[i]?.teams?.home?.name}</div>
                </div>
            ,
            age:
                <div className="vs_main_container">
                    <div className="leauge_container">{liveMatchesData[i]?.league?.name}</div>
                    <div className="vs_container">V/S</div>
                    <div className="time_container"><span>{liveMatchesData[i]?.goals?.home}</span> - <span>{liveMatchesData[i]?.goals?.away}</span></div>
                </div>,
            address:
                <div className='home_team_main_container away_team_main_container'>
                    <div className="name_container">{liveMatchesData[i]?.teams?.away?.name}</div>
                    <div className="icon_container">
                        <img src={liveMatchesData[i]?.teams?.away?.logo} alt={liveMatchesData[i]?.teams?.away?.name} />
                    </div>
                </div>,
        });
    }
    // Upcoming Matches Data
    for (let i = 0; i < upcomingMatchesData?.length; i++) {
        upcomingMatches.push({
            key: i,
            name:
                <div className='home_team_main_container' onClick={() => logCurrentMatchSelection(i)}>
                    <div className="icon_container">
                        <img src={upcomingMatchesData[i]?.teams?.home?.logo} alt={upcomingMatchesData[i]?.teams?.home?.name} />
                    </div>
                    <div className="name_container">{upcomingMatchesData[i]?.teams?.home?.name}</div>
                </div>
            ,
            age:
                <div className="vs_main_container" onClick={() => logCurrentMatchSelection(i)}>
                    <div className="leauge_container">{upcomingMatchesData[i]?.league?.name}</div>
                    <div className="vs_container">V/S</div>
                    <div className="time_container"><span></span> Match start at {convertUSTdateinIST(upcomingMatchesData[i]?.fixture?.date)}<span></span></div>
                </div>,
            address:
                <div className='home_team_main_container away_team_main_container' onClick={() => logCurrentMatchSelection(i)}>
                    <div className="name_container">{upcomingMatchesData[i]?.teams?.away?.name}</div>
                    <div className="icon_container">
                        <img src={upcomingMatchesData[i]?.teams?.away?.logo} alt={upcomingMatchesData[i]?.teams?.away?.name} />
                    </div>
                </div>,
        });
    }
    function logCurrentMatchSelection(value) {
        {
            upcomingMatchesData && upcomingMatchesData.map((item, index) => {
                if (value === index) {
                    // return console.log(value);
                    // return console.log(item.fixture.id);
                    return dispatch(setUpcomingMatchFixtureId(item.fixture.id));
                }
            })
        }
    }
    return (
        <>
            <div className="">
                <div className="match_cards_conntainer">
                    <div className="bg_container">
                        <NavigationBar />
                        <div className="dashboard_container">
                            <div className="dashboard_centre_frame_container">
                                <div className="dashboard_centre_frame max_width">
                                    <div className="frame_bg">
                                        <div className="content_main_container">
                                            <div className="live_matches_main_container">
                                                <Tabs defaultActiveKey="2" onChange={callback} className='live_matches_tabs'>

                                                    <TabPane tab="Finished Matches" key="3" style={{ color: "white" }}>
                                                        {!loading && (
                                                            <>
                                                                <Link to="/finishedActiveBet">
                                                                    <Table
                                                                        columns={columns}
                                                                        dataSource={prevMatches}
                                                                        pagination={{ pageSize: 30 }}
                                                                        scroll={{ y: 378 }}
                                                                        pagination={false}
                                                                    />
                                                                </Link>
                                                            </>
                                                        )}
                                                        {loading && (<h1 className='loading'>Loading...</h1>)}
                                                    </TabPane>
                                                    <TabPane tab="Live Matches" key="1" style={{ color: "white" }}>

                                                        {!loading && (
                                                            <>
                                                                <Link to="/liveActiveBet">
                                                                    <Table
                                                                        columns={columns}
                                                                        dataSource={liveMatches}
                                                                        pagination={{ pageSize: 30 }}
                                                                        scroll={{ y: 378 }}
                                                                        pagination={false}
                                                                    />
                                                                </Link >
                                                            </>
                                                        )}
                                                        {loading && (<h1 className='loading'>Loading...</h1>)}
                                                    </TabPane>
                                                    <TabPane tab="Upcoming Matches" key="2" style={{ color: "white" }}>
                                                        {!loading && (
                                                            <>
                                                                <Link to="/activeBet">
                                                                    {/* <span onClick={(e) => {
                                                                    console.log("hello", upcomingMatchesData && upcomingMatchesData)
                                                                    console.log("select", e.currentTarget);
                                                                    logCurrentMatchSelection(e.currentTarget)
                                                                }}> */}
                                                                    <Table
                                                                        columns={columns}
                                                                        dataSource={upcomingMatches}
                                                                        pagination={{ pageSize: 30 }}
                                                                        scroll={{ y: 378 }}
                                                                        pagination={false}

                                                                    />
                                                                    {/* </span> */}
                                                                </Link>
                                                            </>
                                                        )}
                                                        {loading && (<h1 className='loading'>Loading...</h1>)}
                                                    </TabPane>


                                                </Tabs>
                                            </div>

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

export default LiveMatches;