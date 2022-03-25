
import React, { useState } from 'react';
import NavigationBar from '../../components/Navbar'
import { useDispatch } from 'react-redux';
import { Avatar, Image } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import './index.scss'

const ProfilePage = () => {
    const dispatch = useDispatch();
    const [selectedUser, setSelectedUser] = useState(0)

    const userImg = [
        {
            id: 1,
            src: "https://joeschmoe.io/api/v1/random"
        },
        {
            id: 2,
            src: "https://joeschmoe.io/api/v1/animal"
        },
        {
            id: 3,
            src: "https://joeschmoe.io/api/v1/cat"
        },
        {
            id: 4,
            src: "https://joeschmoe.io/api/v1/tiger"
        },
        {
            id: 5,
            src: "https://joeschmoe.io/api/v1/men"
        },
        {
            id: 1,
            src: "https://joeschmoe.io/api/v1/lady"
        },
    ]


    return (
        <div className="profile_page_main_container">
            <div className="bg_container">
                <NavigationBar />
                <div className="dashboard_container">
                    <div className="dashboard_centre_frame_container">
                        <div className="dashboard_centre_frame max_width">
                            <div className="frame_bg">
                                <div className="content_main_container">
                                    <div className="avarat_container" >
                                        {userImg.map((item, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    < Avatar src={item.src} size={55} className={selectedUser === index ? 'single_avatar selected_avatar' : 'single_avatar '} onClick={(() => {
                                                        setSelectedUser(index)
                                                        console.log(item.src)
                                                    })} />
                                                </React.Fragment>
                                            )
                                        })}
                                    </div>
                                    <div className="detail_container">
                                        <div className="input_container">
                                            <label htmlFor="name">Name :</label> <br />
                                            <input type="text" name="name" id="name" />
                                        </div>

                                    </div>
                                    <div className="button">
                                        <div className="btn_container"><span>Create</span> </div>
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

export default ProfilePage;