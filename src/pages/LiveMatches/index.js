import React from 'react'
import { Card } from 'antd';
import './index.scss';

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};
const LiveMatches = () => {

    return (
        <>
            <div className="container">



                <div className="match_cards_conntainer">
                    <Card title="Live Matches" className='text-center mt-4'>
                        <Card.Grid style={gridStyle}>IND vs AUS</Card.Grid>
                        <Card.Grid style={gridStyle}>IND vs PAK</Card.Grid>
                        <Card.Grid style={gridStyle}>SL vs SA</Card.Grid>
                        <Card.Grid style={gridStyle}>VI vs ENG</Card.Grid>

                    </Card>
                </div>

            </div>
        </>
    )

}

export default LiveMatches;