import React from 'react'
import NavigationBar from '../../components/Navbar';
import { Card } from 'antd';
import './index.scss';
import { Nav, NavLink } from 'react-bootstrap';

const SelectProfile = () => {
    const { Meta } = Card;

    const gridStyle = {
        width: '20%',
        textAlign: 'center',
        disply: "flex",
        justifyContent: "space-between",
        padding: "0",
        fontSize: "2rem",
    };

    return (
        <>
            <div className=" select_profile">

                <div className="bg_container">
                    <NavigationBar />
                    <div className="dashboard_container">
                        <div className="dashboard_centre_frame_container">
                            <div className="dashboard_centre_frame max_width">
                                <div className="frame_bg">
                                    <div className="content_main_container">
                                        <div className="select_sport_container">
                                            <Card
                                                hoverable
                                                style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                                cover={<img alt="example" src="https://media.istockphoto.com/photos/football-in-the-sunset-picture-id533861572?b=1&k=20&m=533861572&s=170667a&w=0&h=BnEJndSSxMFdAczWGC_ICPEjYG3ce_hep6maCR8xIF8=" />}
                                                className='sportPage_card'
                                            >
                                                <Meta title="Prlayer Id" />
                                            </Card>
                                            <Card
                                                hoverable
                                                style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                                cover={<img alt="example" src="https://wallpaperaccess.com/full/1088597.jpg" />}
                                                className='sportPage_card'
                                            >
                                                <Meta title="Prayer Id" />
                                            </Card>
                                        </div>
                                        <div className="coming_soon_cards ">
                                            <Card title="Create Profile">
                                                <Card.Grid style={gridStyle}>
                                                    <Nav>
                                                        <Nav.Link href="/profile">+</Nav.Link>
                                                    </Nav>
                                                </Card.Grid>
                                            </Card>
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

export default SelectProfile;