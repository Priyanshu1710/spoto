import React from 'react'
import { Card } from 'antd';
import NavigationBar from '../../components/Navbar'
import './index.scss';

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};
const LiveMatches = () => {

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