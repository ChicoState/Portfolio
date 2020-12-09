import React, { Component } from 'react';
import axios from 'axios';
// DEPRECATED
export default class RecommendedFeed extends Component {
  state = {
    users: '',
  };

  componentDidMount() {
    return axios({
      method: 'GET',
      withCredentials: true,
      url: '/user/recommended',
    })
      .then((res) => {
        this.setState({ users: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const getRecommended = () => {
      axios({
        method: 'GET',
        withCredentials: true,
        url: '/user/recommended',
      })
        .then((res) => {
          this.setState({ users: res.data });
          console.log(this.state.users);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const followUser = (username) => {
      axios({
        method: 'POST',
        withCredentials: true,
        url: '/user/follow',
        data: {
          followee_username: username,
        },
      })
        .then((res) => {
          getRecommended();
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return (
      <div>
        <ul>
          {this.state.users
            ? this.state.users.map((item) => (
                <li key={item._id}>
                  {item.username}
                  {item.first_name}
                  {item.last_name}
                  <button
                    type="button"
                    onClick={() => followUser(item.username)}
                  >
                    Follow
                  </button>
                </li>
            ))
            : null}
        </ul>
      </div>
    );
  }
}
