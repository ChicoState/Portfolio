import React, { Component } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

class PendingFollowers extends Component {
  state = {
    pending_list: null,
  };

  componentDidMount() {
    axios({
      method: 'GET',
      withCredentials: true,
      url: '/user/pending_followers',
    })
      .then((res) => {
        this.setState({ pending_list: res.data.pending_followers });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleRequest(userName, status) {
    console.log(userName);
    console.log(status);
    axios({
      method: 'POST',
      withCredentials: true,
      url: '/user/handle_follower_request',
      data: {
        follower_username: userName,
        request_status: status,
      },
    })
      .then(() => {
        axios({
          method: 'GET',
          withCredentials: true,
          url: '/user/pending_followers',
        })
          .then((res) => {
            this.setState({ pending_list: res.data.pending_followers });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        {this.state.pending_list ? (
          this.state.pending_list.map((user) => (
            <ul key={user._id}>
              {user.username}
              <Button onClick={() => this.handleRequest(user.username, true)}>
                Accept
              </Button>
              <Button onClick={() => this.handleRequest(user.username, false)}>
                Decline
              </Button>
            </ul>
          ))
        ) : (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </div>
    );
  }
}

export default PendingFollowers;
