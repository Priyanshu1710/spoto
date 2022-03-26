import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ConnectWallet from '../connectWallet'
import './index.scss'


const NavigationBar = () => {
    const dispatch = useDispatch();
    const [userBalance, setUserBalance] = useState();
    const addressbalance = useSelector((state) => state.spoto.userBal);

    useEffect(() => {
        let getBal = localStorage.getItem('userBal')
        setUserBalance(getBal);
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
                            {userBalance > 0 && (
                                <>
                                    <Nav.Link href="" className='wallet_address_container'><div>Balance :&nbsp; </div> <div> {userBalance}</div></Nav.Link>
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
