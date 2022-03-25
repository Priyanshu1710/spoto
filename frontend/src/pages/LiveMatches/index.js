import React from 'react'
import { Card } from 'antd';
import NavigationBar from '../../components/Navbar'
import './index.scss';

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

const LiveMatches = () => {
    // prev matches ********************
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    //         'X-RapidAPI-Key': 'c3b03416cfmshc81e3e32d4e66c4p1b6d9fjsnf9fbc9d9d530'
    //     }
    // };
    
    // fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?last=50', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));


    //live matches *******************
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    //         'X-RapidAPI-Key': 'c3b03416cfmshc81e3e32d4e66c4p1b6d9fjsnf9fbc9d9d530'
    //     }
    // };
    
    // fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));


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


    //upcomming matches
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    //         'X-RapidAPI-Key': 'c3b03416cfmshc81e3e32d4e66c4p1b6d9fjsnf9fbc9d9d530'
    //     }
    // };
    
    // fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?next=50', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));




    return (
        <>
            <div className="">
                <div className="match_cards_conntainer">
                    {/* <Card title="Live Matches" className='text-center mt-4'>
                        <Card.Grid style={gridStyle}>IND vs AUS</Card.Grid>
                        <Card.Grid style={gridStyle}>IND vs PAK</Card.Grid>
                        <Card.Grid style={gridStyle}>SL vs SA</Card.Grid>
                        <Card.Grid style={gridStyle}>VI vs ENG</Card.Grid>

                    </Card> */}
                    <div className="bg_container">
                        <NavigationBar />
                        <div className="dashboard_container">
                            <div className="dashboard_centre_frame_container">
                                <div className="dashboard_centre_frame max_width">
                                    <div className="frame_bg">
                                        <div className="content_main_container">


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