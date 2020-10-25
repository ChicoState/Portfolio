import React, { Component } from 'react';
import axios from 'axios';
import {Spinner, Row} from 'react-bootstrap';
import Post from './Post';
import { getUserName } from './Authentication';

class Feed extends Component {
  state = {
    posts: '',
  };
  componentDidMount() {
    return axios({
      method: 'GET',
      withCredentials: true,
      url: '/post/feed',
    })
      .then((res) => {
        this.setState({ posts: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const deletePost = (post_id) => {
        axios({
          method: "POST",
          data: {
            id: post_id,
          },
          withCredentials: true,
          url: "/post/delete",
        }).then((res) => {
          if (res.status === 200) {
            this.setState(prevState => ({
              posts: prevState.posts.filter(post => post._id !== post_id)
            })
            );
          }
        })
          .catch((error) => console.log(error));
      };

    
    let cur_username = getUserName(this.props.cookies ? this.props.cookies.get('access_token') : null);

    return (
      <Row className="justify-content-center align-items-center">
          {this.state.posts ? (
            this.state.posts.map((item) => {
              return (
                <Post
                  key={item._id}
                  title={item.title}
                  message={item.message}
                  username={item.username}
                  attachments={item.attachments}
                  timestamp={item.timestamp}
                  id={item._id}
                  cur_username={cur_username}
                  deleteHandler={deletePost}
                />
              );
            })
          ) : (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
      </Row>
    );
  }
}
export default Feed;
