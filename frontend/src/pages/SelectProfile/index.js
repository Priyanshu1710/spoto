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

        tokenIds.map(async (item, index) => {
            const ipfs = await Nftprofile.tokenURI(tokenIds[index]);
            let _hex = item._hex;
            const newDs = { profile: ipfs, _hex: _hex }
            return (
                setIpfsLink((data) => [...data, newDs]),
                setprofileLink((data) => [...data, newDs.profile])
            )
            // const newDs = { profile: ipfs, _hex: _hex }
            // return setIpfsLink([...ipfsLink, newDs]);


            // console.log(ipfs)
            // console.log("yg", ipfsLink);

            // console.log("Awatghv", response);

            // for (var i = 0; i < tokenIds.length; i++) {
            //     const ipfs = await Nftprofile.tokenURI(tokenIds[i]).then((response) => {
            //         console.log("Awatghv", response);

            //         setIpfsLink(i);
            //         console.log("test--->", ipfsLink);

            //     });
            //     console.log(ipfs);

            // }

            // const userProfileLink = fetch(ipfsLink);
            // userProfileLink = userProfileLink.JSON();
            // console.log("test--->", ipfsLink);
        })
        // ipfsLink.map((item, index) => {
        //     let data = fetch(item.profile).then((response) => response.json());
        //     console.log("data", data);
        //     setprofileLink(data);

        // })
        // console.log(ipfsLink[0].profile);
        // fetProfile();


    }

    console.log("ipfs data---->", ipfsLink);
    console.log("Profile", profileLink);
    console.log("ProfileArray", profileArray);



    const fetProfile = () => {
        let profile;
        let response;
        let profileData
        profileLink.map(async (item) => {
            // profile = profileLink[item]
            // console.log(profile)
            response = await fetch(item)
            profileData = await response.json()
            console.log("user Profile------>", profileData)
            setProfileArray((profileArray) => [...profileArray, profileData])
            // setProfileArray([...profileData, profileData])
        })
    }

    function returnUserHex(value) {
        ipfsLink.map((item, index) => {
            if (index === value) {
                // return setUserHex(item._hex);
                return (
                    console.log("in map func", item._hex),
                    dispatch(setUserHexValue(item._hex))
                )

            }
            console.log("selected value", value);
        })
    }

    useEffect(() => {
        listTokenIds()
    }, [])
    // useEffect(() => {
    //     // listTokenIds()
    //     fetProfile();

    // }, [profileLink,])


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
                                            {/* <Card
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
                                            </Card> */}

                                            {profileArray.map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        {/* {item.UserName == "kk" && ( */}
                                                        <Link to="/selectSport" ><Card
                                                            hoverable
                                                            style={{ width: 200, height: 200, border: "2px solid #ce18c5" }}
                                                            cover={<img alt="example" src={item.Profile} />}
                                                            className='sportPage_card'
                                                            onClick={() => returnUserHex(index)}
                                                        >
                                                            <Meta title={item.UserName} />
                                                        </Card></Link>

                                                        {/* )} */}

                                                    </React.Fragment>
                                                )
                                            })}

                                        </div>
                                        <div className="coming_soon_cards " >
                                            {/* <Card title="Create Profile">
                                                <Card.Grid style={gridStyle}>
                                                    <Nav onClick={listTokenIds}>
                                                        <Nav.Link href="">+</Nav.Link>
                                                    </Nav>
                                                
                                                </Card.Grid>
                                            </Card>
                                            <Card >
                                                <Card.Grid style={gridStyle}>
                                                    <Nav onClick={fetProfile}>
                                                        <Nav.Link href="">Show</Nav.Link>
                                                    </Nav>
                                                </Card.Grid>
                                            </Card> */}
                                            <div className="title">Create Profile</div>
                                            <div className="btn_main_container">
                                                <Link to='/profile'><div className="button_container">+</div></Link>
                                                <div className="button_container" onClick={fetProfile}>Show Profile</div>
                                                <button onClick={listTokenIds}>test</button>
                                            </div>

                                        </div>
                                        {/* <button onClick={listTokenIds}>test</button> */}

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