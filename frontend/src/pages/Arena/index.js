
import React, { useState } from 'react';
import NavigationBar from '../../components/Navbar'
import { useDispatch } from 'react-redux';
import { setDashboardModalState } from '../../actions';
import './index.scss';


const Arena = () => {
    const dispatch = useDispatch();

    return (
        <div className="arena_page">

            <div className="bg_container">
                <NavigationBar />
                <div className="dashboard_container">
                    <div className="dashboard_centre_frame_container">
                        <div className="dashboard_centre_frame max_width">
                            <div className="frame_bg">
                                <div className="content_main_container">
                                    <div className="arena_main_container">
                                    <div className="heading_container">
                                        <div className="arena_name">India vs Pak</div>
                                        <div className="arena">Arenas</div>
                                    </div>
                                    <div className="cards_container">
                                        <div className="single_cards">
                                            <div className="contenet_container">
                                                <div className="head">
                                                    <div className="heading">Pool Name : </div>
                                                    <div className="value">&nbsp; Mega</div>
                                                </div>
                                                <div className="mid">
                                                    <div className="heading">Entry Fee</div>
                                                    <div className="value">1 eth</div>
                                                </div>
                                                <div className="bottom">
                                                    <div className="heading">Spot Left</div>
                                                    <div className="value">2/10</div>
                                                </div>
                                            </div>
                                            <div className="bottom_container">
                                                <div className="text">View Info</div>
                                            </div>
                                        </div>
                                        {/* card-2  */}
                                        <div className="single_cards">
                                            <div className="contenet_container">
                                                <div className="head">
                                                    <div className="heading">Pool Name : </div>
                                                    <div className="value">&nbsp; Mega</div>
                                                </div>
                                                <div className="mid">
                                                    <div className="heading">Entry Fee</div>
                                                    <div className="value">1 eth</div>
                                                </div>
                                                <div className="bottom">
                                                    <div className="heading">Spot Left</div>
                                                    <div className="value">2/10</div>
                                                </div>
                                            </div>
                                            <div className="bottom_container">
                                                <div className="text">View Info</div>
                                            </div>
                                        </div>
                                        {/* card-3  */}
                                        <div className="single_cards">
                                            <div className="contenet_container">
                                                <div className="head">
                                                    <div className="heading">Pool Name : </div>
                                                    <div className="value">&nbsp; Mega</div>
                                                </div>
                                                <div className="mid">
                                                    <div className="heading">Entry Fee</div>
                                                    <div className="value">1 eth</div>
                                                </div>
                                                <div className="bottom">
                                                    <div className="heading">Spot Left</div>
                                                    <div className="value">2/10</div>
                                                </div>
                                            </div>
                                            <div className="bottom_container">
                                                <div className="text">View Info</div>
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
        </div>
    )
}

export default Arena;