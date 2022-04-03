import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ConnectWallet from '../connectWallet'
import './index.scss'
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { contracts, requestAccount, bigNumberToDecimal, truncateString } from '../../utils';
import { Menu, Dropdown, Button, Space } from 'antd';
import { BsArrowUpRight } from 'react-icons/bs'
import { BiCopy } from 'react-icons/bi'
import logo from '../../assets/images/logo.svg'
import { useLocation } from 'react-router';
// import Web3 from 'web3'

const faucet = async () => {

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // console.log(signer)

    const faucet = new ethers.Contract(
        contracts.FAUCET.address,
        contracts.FAUCET.abi,
        signer
    );

    await faucet.receive_test_token();
};


const ethe = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // console.log(signer)

    const spotogame = new ethers.Contract(
        contracts.SPOTO_GAME.address,
        contracts.SPOTO_GAME.abi,
        signer
    );

    const price = await spotogame.getLatestEthPrice();
    var pr = price.toString().substr(0, price.toString().length - 8)
    localStorage.setItem('ethPrice', pr)
    // console.log(pr)

};


const NavigationBar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [userBalance, setUserBalance] = useState(0);
    const [ethPrice, setethPrice] = useState();
    const [userAdd, setUserAdd] = useState();
    const [nftId, setNftId] = useState();
    const [userProfile, setUserProfile] = useState()
    const [userDetails, setUserDetails] = useState({
        userDetail: {
            NFTId: '',
            gameLevel: "",
            gameLost: "",
            gameWon: ""
        }
    });
    const addressbalance = useSelector((state) => state.spoto.userBal);

    const userAddFromReducerStorage = useSelector((state) => state.spoto.userAdd)
    const userBal = useSelector((state) => state.spoto.userBal);


    useEffect(() => {
        ethe()
        let userAdds = localStorage.getItem('userAddresss');
        setUserAdd(userAdds)
        let getBal = localStorage.getItem('userBal')
        setUserBalance(getBal);
        setethPrice(localStorage.getItem('ethPrice'))
        let prbal = localStorage.getItem('ethPrice')
        setethPrice(prbal);
        let userData = JSON.parse(localStorage.getItem("userDetail"))
        setUserDetails(userData)
        let nftId = localStorage.getItem("userhex");
        setNftId(nftId);
        nftDetail(nftId);
    }, [addressbalance, userBalance, userAdd, ethPrice, userAddFromReducerStorage])

    const nftDetail = async (nftId) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        // console.log(signer)

        const NftProf = new ethers.Contract(
            contracts.NFT_PROFILE.address,
            contracts.NFT_PROFILE.abi,
            signer
        );

        const qrw = await NftProf.tokenURI(nftId);
        // qrw = await fetch(qrw);
        let url = qrw.toString();
        let response = await fetch(url);
        response = await response.json()
        // console.log(qrw)
        // console.log(response);
        // console.log(response.Profile);
        setUserProfile(response.Profile)
    };
    // console.log(userBalance);
    const connectedDropdown = <>
        {userAdd && (
            <div className="connected_main_container ant-dropdown-menu">
                <div className="connected_container">
                    <div className="dropdown_list_container">
                        <div className="left_container">Balance : </div>
                        <div className="right_container">{userBal} SPT</div>
                    </div>
                    <div className="dropdown_list_container">
                        <div className="left_container">ETH Price : </div>
                        <div className="right_container">$ {ethPrice}</div>
                    </div>
                    <div className="dropdown_list_container faucet_link">
                        <div className="left_container">SPT Token : </div>
                        <div className="right_container" onClick={() => { faucet() }} >Faucet <BsArrowUpRight /></div>
                    </div>
                    <div className="user_address_container">
                        <div className="address">{truncateString(userAdd, 9, 9)}</div>
                        <div className="icon"><BiCopy /></div>
                    </div>
                    <div className="disconect_wallet_container">
                        <ConnectWallet />
                    </div>
                </div>
            </div>
        )}
    </>
    const userProfileDetails = <>
        {userAdd && (
            <div className=" connected_main_container user_detais_dropdown_main_container ant-dropdown-menu">
                <div className="connected_container">
                    <div className="dropdown_list_container">
                        <div className="left_container">NFT ID : </div>
                        <div className="right_container">{nftId}</div>
                    </div>
                    <div className="dropdown_list_container">
                        <div className="left_container">Bet Won : </div>
                        <div className="right_container">{parseInt(userDetails?.userDetail?.gameWon)}</div>
                    </div>
                    <div className="dropdown_list_container ">
                        <div className="left_container">Bet Lost : </div>
                        <div className="right_container"  >{parseInt(userDetails?.userDetail?.gameLost)}</div>
                    </div>
                    <div className="dropdown_list_container">
                        <div className="left_container">Level</div>
                        <div className="right_container">{parseInt(userDetails?.userDetail?.gameLevel)}</div>
                    </div>
                </div>
            </div>
        )}
    </>

    // const connectWallet = <ConnectWallet />
    const connectWallet = <>
        <div className="connect_modal_main_container ant-dropdown-menu">
            <div className="connect_wallet_container">
                <div className='heading'>Connect Wallet</div>
                <div className="connect_btn"><ConnectWallet /></div>
            </div>
        </div>
    </>

    return (
        <div className='navbar_main_container'>
            <Navbar collapseOnSelect expand="lg" variant="dark" className='navbar_container'>
                <Container>
                    <Navbar.Brand href="/">
                        <div className="logo">
                            <img src={logo} alt="Spoto" />
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                        </Nav>
                        <Nav>

                        </Nav>
                        {userAdd && <Nav className='dropdown_nav_main_container btn_container' >
                            <Nav.Link href="" className='dropdown_nav_container'>
                                <Dropdown overlay={connectedDropdown} placement="bottom" className='navbar_dropdown' trigger={['click']}>
                                    <Button>Connected</Button>
                                </Dropdown>
                            </Nav.Link>
                        </Nav>}
                        {!userAdd && <Nav className='dropdown_nav_main_container btn_container' >
                            <Nav.Link href="" className='dropdown_nav_container'>
                                <Dropdown overlay={connectWallet} placement="bottom" className='navbar_dropdown' trigger={['click']}>
                                    <Button>Connect Wallet</Button>
                                </Dropdown>
                            </Nav.Link>
                        </Nav>}
                        {/* <span className='user_icon_main_container'> */}
                        {location.pathname !== '/' && location.pathname !== '/selectProfile' && (
                            <Dropdown overlay={userProfileDetails} placement="bottom" className='user_details' trigger={['click']}>
                                <Button> <img src={userProfile} alt="" /></Button>
                            </Dropdown>
                        )}
                        {/* </span> */}
                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </div>
    )
}

export default NavigationBar;
