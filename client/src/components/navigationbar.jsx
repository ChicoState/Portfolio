import React, { Component } from 'react';
import {  Navbar, Nav } from 'react-bootstrap';
import logo from '../portfolio_text.jpg';
import '../App.css';
import LogoutClass from './logout';

class NavigationBar extends Component {
    render() {
      return (
        <Navbar collapseOnSelect  expand="md" bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <img src={logo} className="App-logo" alt="logo" />
          </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <div className="col-sm-8" />
          <div className="col-sm-2" >
          <LogoutClass/>
          </div>
          <div className="col-sm-2">
          <Nav>
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