import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import ConnectWallet from '../connectWallet'
import './index.scss'

const NavigationBar = () => {
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
                            <Nav.Link href=""><ConnectWallet /></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </div>
    )
}

export default NavigationBar;
