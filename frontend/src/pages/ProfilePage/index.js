
import React, { useEffect, useState } from 'react';
import NavigationBar from '../../components/Navbar'
import { useDispatch } from 'react-redux';
import { Avatar, Image } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';


import { contracts } from '../../utils';
// import { useHistory } from "react-router-dom";
// import { BrowserRouter as Router, Route } from "react-router-dom"
// import { Route, Routes } from "react-router-dom";
import { Navigate, useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import socialIcon from '../../assets/images/social_icon.png'
import beachIcon from '../../assets/images/beach.png'
import narrativeIcon from '../../assets/images/narrative.png'
import challengeIcon from '../../assets/images/challenge.png'
import goalIcon from '../../assets/images/goal.png'

import './index.scss'
const IPFS = require('ipfs-mini');

const ProfilePage = () => {
    let navigate = useNavigate();
    const [redirectPath, setRedirectPath] = useState(false)
    const createNFT = async () => {
        ips(username, trait, selectedUser);

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const NFTContract = new ethers.Contract(
            contracts.NFT_PROFILE.address,
            contracts.NFT_PROFILE.abi,
            signer
        );
        const transaction = await NFTContract.safeMint(ipfsUrl);
        setRedirectPath(true)
        console.log(transaction);
        let tx = await transaction.wait();
        console.log(tx)
        let event = tx.events[0];
        let value = event.args[2];

        if (tx['transactionIndex'] != null) {
            // window.location.href = '/selectProfile';
            // history.push("/selectProfile");
            // <Routes>
            //     <Route path='/selectProfile' />
            // </Routes>
            setRedirectPath(false)
            navigate("/selectProfile", { replace: true })
            // <Redirect push to="/selectProfile" />

        }
    };

    const [username, setUsername] = useState();
    const [trait, setTrait] = useState();
    const [ipfsUrl, setIpfsUrl] = useState();

    const ips = (Username, Trait, Profile) => {
        const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        const data = { "UserName": Username, "Trait": Trait, "Profile": Profile };
        ipfs.addJSON(data, (err, hash) => {
            if (err) {
                return console.log(err);
            }
            setIpfsUrl('https://ipfs.infura.io/ipfs/' + hash);
        })
    }

    const dispatch = useDispatch();
    const [selectedUser, setSelectedUser] = useState(0)
    const [selectedAvatar, setSelectedAvatar] = useState(0)

    const { Option } = Select;
    function handleChange(value) {
        setTrait(value);
    }
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

    // useEffect(() => {
    //     { redirectPath && <Navigate push to="/selectProfile" /> }
    //     console.log(redirectPath)
    // }, [redirectPath])

    return (
        <div className="profile_page_main_container">
            <div className="bg_container">
                <NavigationBar />
                <div className="dashboard_container">
                    <div className="dashboard_centre_frame_container">
                        <div className="dashboard_centre_frame max_width">
                            <div className="frame_bg">
                                <div className="content_main_container">
                                    {redirectPath && (
                                        <>
                                            <h1 className='loading'>NFT Minting...</h1>
                                        </>
                                    )}
                                    {redirectPath === false && (
                                        <>

                                            <div className="avarat_container" >
                                                {userImg.map((item, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            < Avatar src={item.src} size={55} className={selectedAvatar === index ? 'single_avatar selected_avatar' : 'single_avatar '} onClick={(() => {
                                                                setSelectedUser(item.src)
                                                                setSelectedAvatar(index)
                                                                console.log(item.src)
                                                            })} />
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </div>
                                            <div className="detail_container">
                                                <div className="input_container">
                                                    <label htmlFor="name">UserName :</label> <br />
                                                    <input type="text" name="name" id="name" onChange={event => setUsername(event.target.value)} />
                                                    <label htmlFor="trait">Trait :</label> <br />
                                                    {/* <input type="text" name="trait" id="trait" onChange={event => setTrait(event.target.value)} /> */}
                                                    <Select
                                                        labelInValue
                                                        defaultValue={{ value: 'Select Trait' }}
                                                        style={{ width: "100% " }}
                                                        onChange={(e) => {
                                                            handleChange(e.value);
                                                        }}
                                                        className='input_select'
                                                    >
                                                        <Option value="social">
                                                            <div className="option_main_container">
                                                                <div className="option_container">
                                                                    <span className="icon">
                                                                        <img src={socialIcon} alt="" />
                                                                    </span>
                                                                    <span className="name">&nbsp; Social</span>
                                                                </div>
                                                            </div>

                                                        </Option>
                                                        <Option value="aesthetic">
                                                            <div className="option_main_container">
                                                                <div className="option_container">
                                                                    <span className="icon">
                                                                        <img src={beachIcon} alt="" />
                                                                    </span>
                                                                    <span className="name">&nbsp; Aesthetic</span>
                                                                </div>
                                                            </div>

                                                        </Option>
                                                        <Option value="narrative">
                                                            <div className="option_main_container">
                                                                <div className="option_container">
                                                                    <span className="icon">
                                                                        <img src={narrativeIcon} alt="" />
                                                                    </span>
                                                                    <span className="name">&nbsp; Narrative</span>
                                                                </div>
                                                            </div>

                                                        </Option>
                                                        <Option value="challenge">
                                                            <div className="option_main_container">
                                                                <div className="option_container">
                                                                    <span className="icon">
                                                                        <img src={challengeIcon} alt="" />
                                                                    </span>
                                                                    <span className="name">&nbsp; Challenge</span>
                                                                </div>
                                                            </div>

                                                        </Option>
                                                        <Option value="goal">
                                                            <div className="option_main_container">
                                                                <div className="option_container">
                                                                    <span className="icon">
                                                                        <img src={goalIcon} alt="" />
                                                                    </span>
                                                                    <span className="name">&nbsp; Goal</span>
                                                                </div>
                                                            </div>

                                                        </Option>

                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="button">
                                                <div className="btn_container" onClick={() => {
                                                    createNFT()
                                                }}><span>Create NFT</span> </div>
                                            </div>
                                        </>
                                    )}
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