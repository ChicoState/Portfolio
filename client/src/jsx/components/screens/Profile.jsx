import React, { Component } from 'react';
import { authenticated } from '../Authentication';
import { Redirect } from 'react-router-dom';
import DisplayPost from '../DisplayPost';

class Profile extends Component {
  render() {
    return (
      <div>
        {this.props.cookies &&
        authenticated(this.props.cookies.get('access_token')) ? (
          <DisplayPost cookies={this.props.cookies}/>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default Profile;