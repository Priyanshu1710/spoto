import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ConnectWallet from '../connectWallet'
import './index.scss'
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { contracts, requestAccount, bigNumberToDecimal} from '../../utils';
// import Web3 from 'web3'

const faucet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(signer)

    const faucet = new ethers.Contract(
        contracts.FAUCET.address,
        contracts.FAUCET.abi,
        signer
    );

    const faucetSpt = await faucet.receive_test_token();
    console.log(faucetSpt)

};
const ethe = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(signer)

    const spotogame = new ethers.Contract(
        contracts.SPOTO_GAME.address,
        contracts.SPOTO_GAME.abi,
        signer
    );

    const price = await spotogame.getLatestEthPrice();
    console.log(localStorage.getItem("userAddresss"))
    // const userbalance = Eth.getBalance(requestAccount);
    // console.log(userbalance)
    var pr = price.toString().substr(0, price.toString().length - 8)
    localStorage.setItem('ethPrice', pr)

};

const NavigationBar = () => {
    const dispatch = useDispatch();
    const [userBalance, setUserBalance] = useState();
    const [ethPrice, setethPrice] = useState();
    const addressbalance = useSelector((state) => state.spoto.userBal);

    useEffect(() => {
        ethe()
        let getBal = localStorage.getItem('userBal')
        setUserBalance(getBal);
        setethPrice(localStorage.getItem('ethPrice'))
    }, [addressbalance])

    return (
        <div className='navbar_main_container'>
            <Navbar collapseOnSelect expand="lg" variant="dark" className='navbar_container'>
                <Container>
                    <Navbar.Brand href="/">SPOTO</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                        </Nav>
                        <Nav>
                            <Nav.Link href="" className='wallet_address_container'><div>SPT Token &nbsp; </div> <div onClick={faucet}> Faucet</div></Nav.Link>

                            {userBalance > 0 && (
                                <>
                                    <Nav.Link href="" className='wallet_address_container'><div>Balance </div> <div> {userBalance} SPT</div></Nav.Link>
                                    <Nav.Link href="" className='wallet_address_container'><div>Eth Price &nbsp; </div><div> ${ethPrice}</div></Nav.Link>
                                </>
                            )}
                            {/* <Nav.Link href="" className='wallet_address_container'>Balance : 0</Nav.Link> */}
                        </Nav>
                        <Nav>
                            <Nav.Link href=""><ConnectWallet /></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </div>
    )
}

export default NavigationBar;
