import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Logout extends Component {
  render() {
    const logout = () => {
      axios({
        method: "GET",
        withCredentials: true,
        url: "/user/logout",
      })
        .then((res) => { return true; })
        .catch((error) => {
          return false;
        });
    };

    logout();
    return <Redirect to={'/'}/>
  }

}
export default Logout;
