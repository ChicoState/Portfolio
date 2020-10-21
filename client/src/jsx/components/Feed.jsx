import React, { Component } from 'react';
import axios from 'axios';
import {Container, Spinner} from 'react-bootstrap';
import Post from './Post';

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
    return (
      <Container className="col-md-8">
          {this.state.posts ? (
            this.state.posts.map((item, index) => {
              return (
                <Post
                  key={index}
                  title={item.title}
                  message={item.message}
                  username={item.username}
                  attachments={item.attachments}
                  id={item._id}
                  delete="false"
                />
              );
            })
          ) : (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
      </Container>
    );
  }
}
export default Feed;
