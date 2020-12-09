import React, { Component } from 'react';
import FollowButton from './FollowButton';

class ProfileHeader extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.username}</h1>
        <FollowButton
          cookies={this.props.cookies}
          pageUsername={this.props.pageUsername}
        />
      </div>
    );
  }
}

export default ProfileHeader;
