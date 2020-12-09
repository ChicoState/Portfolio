import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { authenticated } from '../Authentication';
import UpdateName from '../UpdateName';
import UpdatePassword from '../UpdatePassword';

class Account extends Component {
  render() {
    return (
      <div>
        {this.props.cookies &&
        authenticated(this.props.cookies.get('access_token')) ? (
          <div>
            <UpdateName />
            <UpdatePassword />
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default Account;
