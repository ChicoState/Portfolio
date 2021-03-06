import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, withRouter } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { authenticated } from '../Authentication';
import ProfileHeader from '../ProfileHeader';
import DisplayPost from '../DisplayPost';
import NotFound from './NotFound';

class Profile extends Component {
  state = {
    exists: null,
  };

  componentDidMount() {
    return axios({
      method: 'GET',
      withCredentials: true,
      url: `/user/exists/${this.props.match.params.username}`,
    })
      .then((res) => {
        this.setState({ exists: res.data.exists });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ exists: false });
      });
  }

  render() {
    if (
      !this.props.cookies ||
      !authenticated(this.props.cookies.get('access_token'))
    ) {
      return <Redirect to="/login" />;
    }
    if (this.state.exists) {
      return (
        <div>
          <ProfileHeader
            cookies={this.props.cookies}
            pageUsername={this.props.match.params.username}
          />
          <DisplayPost
            cookies={this.props.cookies}
            username={this.props.match.params.username}
          />
        </div>
      );
    }
    if (this.state.exists === null) {
      return <Spinner />;
    }
    return <NotFound />;
  }
}

export default withRouter(Profile);
