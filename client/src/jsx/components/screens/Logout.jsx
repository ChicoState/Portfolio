import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

class Logout extends Component {
  next = () => {
    this.props.history.replace(
      this.props.location.state ? this.props.location.state.from.pathname : '/'
    );
  };
  logout = () => {
    axios({
      method: 'GET',
      withCredentials: true,
      url: '/user/logout',
    })
      .then((res) => {
        this.next();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.logout();
  }
  render() {
    return (
      <div>
        <h1>Logging out...</h1>
        <Spinner></Spinner>
      </div>
    );
  }
}
export default withRouter(Logout);
