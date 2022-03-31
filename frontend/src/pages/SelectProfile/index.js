import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import NavigationBar from '../../components/Navbar';
import { Card } from 'antd';
import './index.scss';
import { Nav, NavLink } from 'react-bootstrap';
import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import { contracts, bigNumberToDecimal, accnt } from '../../utils/index'
import { requestAccount } from '../../utils/index';
import Item from 'antd/lib/list/Item';
import { useDispatch } from 'react-redux';
import { setUserHexValue } from '../../actions';





const SelectProfile = () => {
    const dispatch = useDispatch();
    const [ipfsLink, setIpfsLink] = useState([])
    const [profileLink, setprofileLink] = useState([]);
    const [profileArray, setProfileArray] = useState([])
    const [filteredProfileArray, setFilteredProfileArray] = useState([]);
    const [userHex, setUserHex] = useState();
    const [userData, setUserData] = useState({
        _hex: [],
        profile: []
    })

    const listTokenIds = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const Nftprofile = new ethers.Contract(
            contracts.NFT_PROFILE.address,
            contracts.NFT_PROFILE.abi,
            signer
        );
        const tokenIds = await Nftprofile.walletOfOwner(requestAccount());
        console.log(tokenIds);
        // tokenIds.map(async (item, index) => {
        //     item.map((singleItem) => {
        //         console.log("Inside map-->", singleItem);
        //         let _hex = singleItem._hex;
        //         console.log(_hex);
        //     })
        //     const ipfs = Nftprofile.tokenURI(tokenIds[index]);

        //     // console.log(_hex);
        //     // const newDs = { _hex: _hex }
        //     console.log(index);
        //     console.log("tikenId Map-->", item);
        //     // setIpfsLink((data) => [...data, newDs])

        //     return (
        //         // setIpfsLink((data) => [...data, newDs]),
        //         // setprofileLink((data) => [...data, newDs.profile])
        //         item
        //     )
        // })
        // tokenIds.forEach((item, index) => {
        tokenIds[0].forEach((singleItem) => {
            console.log("InSide forEach-=>", singleItem._hex);
            setUserData({ ...userData }, userData._hex.push(singleItem._hex))
        })
        tokenIds[1].forEach((singleItem) => {
            console.log("InSide forEach-=>", singleItem);
            setUserData({ ...userData }, userData.profile.push(singleItem))
        })
        // console.log(item);
        // })
    }

    // console.log("ipfs data---->", ipfsLink);
    // console.log("Profile", profileLink);
    // console.log("ProfileArray", profileArray);
    console.log("UserData", userData);



    const fetProfile = () => {
        let profile;
        let response;
        let profileData
        userData.profile.map(async (item) => {
            response = await fetch(item)
            profileData = await response.json()
            console.log("user Profile------>", profileData)
            setProfileArray((profileArray) => [...profileArray, profileData])
            // setProfileArray([...profileData, profileData])
        })
    }

    function returnUserHex(value) {
        userData._hex.map(async (item, index) => {
            // console.log(item);
            if (index === value) {
                console.log(item, index);
                return (
                    dispatch(setUserHexValue(item))
                )
            }
            console.log("selected value", value);
        })
    }

    useEffect(() => {
        listTokenIds().then((res) => {
            console.log(res);
            fetProfile()
        })
    }, [])


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
                                            {profileArray.map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>

                                                        <Link to="/selectSport" ><Card
                                                            hoverable
                                                            style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                                            cover={<img alt="example" src={item.Profile} />}
                                                            className='sportPage_card'
                                                            onClick={() => returnUserHex(index)}
                                                        >
                                                            <Meta title={item.UserName} />
                                                        </Card></Link>

                                                    </React.Fragment>
                                                )
                                            })}

                                        </div>
                                        <div className="coming_soon_cards " >
                                            <div className="title">{userData.profile <= 0 && "Please Create Profile"}</div>
                                            <div className="btn_main_container">
                                                <Link to='/profile'><div className="button_container">+</div></Link>
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

export default SelectProfile;