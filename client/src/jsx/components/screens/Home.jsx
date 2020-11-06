import React, { Component } from 'react';
import Feed from '../Feed';
import Follow from '../Follow';
import RecommendedFeed from '../RecommendedFeed';
import { authenticated, getUserName } from '../Authentication';

class Home extends Component {
  render() {
    return (
      <div>
        {this.props.cookies &&
        authenticated(this.props.cookies.get('access_token')) ? (
          <div>
            <h1>
              Welcome back,{' '}
              {getUserName(this.props.cookies.get('access_token'))}
            </h1>
            <Feed cookies={this.props.cookies}/>
            {/* { <Follow /> } */}
            {/* { <RecommendedFeed /> } */}
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
