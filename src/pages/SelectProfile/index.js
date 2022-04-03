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
import { setUserDetails, setUserHexValue } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';





const SelectProfile = () => {
    const nftId = useSelector((state) => state.spoto.selectedUserhex);
    let navigate = useNavigate();
    const [redirectPath, setRedirectPath] = useState(false)

    const dispatch = useDispatch();
    const [ipfsLink, setIpfsLink] = useState([])
    const [profileLink, setprofileLink] = useState([]);
    const [profileArray, setProfileArray] = useState([])
    const [loading, setLoading] = useState(false)
    const [filteredProfileArray, setFilteredProfileArray] = useState([]);
    const [userNftId, setUserNftid] = useState(0);
    const [userData, setUserData] = useState({
        _hex: [],
        profile: []
    })
    const [userDetail, setuserDetail] = useState({
        NFTId: "",
        gameWon: "",
        gameLost: "",
        gameLevel: "",
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
        // console.log(tokenIds);
        tokenIds[0].forEach((singleItem) => {
            setUserData({ ...userData }, userData._hex.push(singleItem._hex))
        })
        tokenIds[1].forEach((singleItem) => {
            setUserData({ ...userData }, userData.profile.push(singleItem))
        })

    }

    const NftProfile = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const Nftprof = new ethers.Contract(
            contracts.SPOTO_GAME.address,
            contracts.SPOTO_GAME.abi,
            signer
        );
        setRedirectPath(true)
        const profDetails = await Nftprof.getNftDetails(nftId).then(
            setLoading(true),
            setRedirectPath(false),
            setTimeout(() => {
                setLoading(false)
                navigate("/selectSport", { replace: true })

            }, 3000)
        );

        return (
            setuserDetail((prevStage) => ({
                ...prevStage,
                NFTId: "",
                gameWon: profDetails.bets_won._hex,
                gameLost: profDetails.bets_lost._hex,
                gameLevel: profDetails.profile_level._hex
            }))

        );
    }

    // setuserDetail({ ...userDetail, NFTId: userNftId })

    const fetProfile = () => {
        let profile;
        let response;
        let profileData
        userData.profile.map(async (item) => {
            response = await fetch(item)
            profileData = await response.json()
            setProfileArray((profileArray) => [...profileArray, profileData])
        })
    }

    function returnUserHex(value) {
        userData._hex.map(async (item, index) => {
            if (index === value) {
                return (
                    dispatch(setUserHexValue(item)),
                    setUserNftid(item),
                    localStorage.setItem("userhex", item)
                )
            }
        })
        NftProfile();
    }

    useEffect(() => {
        listTokenIds().then((res) => {
            fetProfile()
        })
        dispatch(setUserDetails({ userDetail }))

        localStorage.setItem("userDetail", JSON.stringify({ userDetail }))
    }, [userDetail])


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
                                        {!loading && (
                                        <div className="cards_up_main_heading">
                                            <div className="text">Select Profile</div>
                                        </div>
                                        )}
                                        {loading && (
                                            <>
                                                <div className="loading">Please Wait...</div>
                                            </>
                                        )}
                                        {!loading && (
                                            <div className="select_sport_container">
                                                {profileArray.map((item, index) => {
                                                    return (
                                                        <React.Fragment key={index}>

                                                            <Card
                                                                hoverable
                                                                style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                                                cover={<img alt="example" src={item.Profile} />}
                                                                className='sportPage_card'
                                                                onClick={() => returnUserHex(index)}
                                                            >
                                                                <Meta title={item.UserName} />
                                                            </Card>

                                                        </React.Fragment>
                                                    )
                                                })}

                                            </div>
                                        )}
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