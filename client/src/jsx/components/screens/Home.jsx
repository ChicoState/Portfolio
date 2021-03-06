import React, { Component } from 'react';
import Feed from '../Feed';
import { authenticated, getUserName } from '../Authentication';

class Home extends Component {
  render() {
    return (
      <div>
        {this.props.cookies &&
        authenticated(this.props.cookies.get('access_token')) ? (
          <div>
            <h1>
              Welcome Back,{' '}
              {getUserName(this.props.cookies.get('access_token'))}
            </h1>
            <Feed cookies={this.props.cookies} />
          </div>
        ) : (
          <div>
            <h1>Welcome</h1>
            <Feed />
          </div>
        )}
      </div>
    );
  }
}

export default Home;
