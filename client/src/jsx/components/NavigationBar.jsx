import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';
import { getUserName } from './Authentication';
import '../../css/App.css';

class NavigationBar extends Component {
  render() {
    let curUsername = null;
    if (this.props.cookies.get('access_token')) {
      curUsername = getUserName(this.props.cookies.get('access_token'));
    }
    return (
      <Navbar
        bg="light"
        expand="lg"
        className="NavBar"
        sticky="top"
        collapseOnSelect
      >
        <IndexLinkContainer to="/">
          <Navbar.Brand>
            <img src="/logo.png" className="App-logo" alt="logo" />
          </Navbar.Brand>
        </IndexLinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <IndexLinkContainer key="1" to="/">
              <Nav.Link active={false} eventKey="1">
                Home
              </Nav.Link>
            </IndexLinkContainer>
            <IndexLinkContainer key="7" to="/discovery">
              <Nav.Link active={false} eventKey="1">
                Discover
              </Nav.Link>
            </IndexLinkContainer>
          </Nav>
          <Nav className="ml-auto">
            {curUsername
              ? [
                  <IndexLinkContainer
                    key="2"
                    exact
                    to={`/profile/${curUsername}`}
                  >
                    <Nav.Link active={false} eventKey="2">
                      Profile
                    </Nav.Link>
                  </IndexLinkContainer>,
                  <IndexLinkContainer key="3" exact to="/account">
                    <Nav.Link active={false} eventKey="3">
                      Account
                    </Nav.Link>
                  </IndexLinkContainer>,
                  <IndexLinkContainer key="4" exact to="/logout">
                    <Nav.Link active={false} eventKey="4">
                      Logout
                    </Nav.Link>
                  </IndexLinkContainer>,
                ]
              : [
                  <IndexLinkContainer
                    key="5"
                    exact
                    to={{
                      pathname: '/login',
                      state: { from: this.props.location },
                    }}
                  >
                    <Nav.Link active={false} eventKey="5">
                      Login
                    </Nav.Link>
                  </IndexLinkContainer>,
                  <IndexLinkContainer
                    key="6"
                    exact
                    to={{
                      pathname: '/signup',
                      state: { from: this.props.location },
                    }}
                  >
                    <Nav.Link active={false} eventKey="6">
                      Sign Up
                    </Nav.Link>
                  </IndexLinkContainer>,
                ]}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
