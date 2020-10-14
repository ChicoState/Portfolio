import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../portfolio_text.jpg';
import LogoutClass from './logout';

class NavigationBar extends Component {
    render() {
      return (
        <Navbar className="NavBar" collapseOnSelect  expand="md" >
          <Navbar.Brand href="/">
            <img src={logo}  className="App-logo" alt="logo" />
          </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <div className="col-sm-9" />
          <div className="col-sm-3">
          <Nav>
            <LogoutClass/>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
          </Nav>
          </div>
        </Navbar.Collapse>
      </Navbar>
      );
    }
}

export default NavigationBar;