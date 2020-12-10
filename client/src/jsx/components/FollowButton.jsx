import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { getUserName } from './Authentication';
import PendingFollowers from './PendingFollowers';

class FollowButton extends Component {
  state = {
    followStatus: null,
    visibility: null,
  };

  componentDidMount() {
    this.getFollowState(this.props.pageUsername);
  }

  getFollowState(followeeUsername) {
    axios({
      method: 'GET',
      withCredentials: true,
      url: '/user/follow_status',
      params: {
        followee_username: followeeUsername,
      },
    })
      .then((res) => {
        console.log(res);
        this.setState({
          followStatus: res.data.follow_status,
          visibility: res.data.visibility,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  followUser(followeeUsername) {
    axios({
      method: 'PUT',
      withCredentials: true,
      url: '/user/follow',
      data: {
        followee_username: followeeUsername,
      },
    })
      .then((res) => {
        this.setState({ followStatus: res.data.follow_status });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  togglePublic(username) {
    axios({
      method: 'PUT',
      withCredentials: true,
      url: '/user/visibility',
      data: {
        username,
      },
    })
      .then((res) => {
        this.setState({ visibility: res.data.visibility });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const pageUser = getUserName(this.props.cookies.get('access_token'));
    if (this.props.pageUsername === pageUser) {
      return (
        <div>
          <Button onClick={() => this.togglePublic(this.props.pageUsername)}>
            {this.state.visibility ? 'Public' : 'Private'}
          </Button>
          <PendingFollowers
            cookies={this.props.cookies}
            pageUsername={this.props.pageUsername}
          />
        </div>
      );
    }
    let buttonText;
    if (this.state.followStatus === 'followed') {
      buttonText = 'Unfollow';
    } else if (this.state.followStatus === 'unfollowed') {
      buttonText = 'Follow';
    } else if (this.state.followStatus === 'pending') {
      buttonText = 'Requested';
    } else {
      buttonText = this.state.followStatus;
    }
    return (
      <Button onClick={() => this.followUser(this.props.pageUsername)}>
        {buttonText}
      </Button>
    );
  }
}

export default FollowButton;
