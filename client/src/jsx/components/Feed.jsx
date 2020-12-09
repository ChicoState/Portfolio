import React, { Component } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './Post';
import { getUserName } from './Authentication';

class Feed extends Component {
  state = {
    posts: null,
    next: null,
    hasNext: false,
  };

  componentDidMount() {
    this.fetchPosts(null);
  }

  fetchPosts(next) {
    return axios({
      method: 'GET',
      withCredentials: true,
      url: '/post/feed',
      params: {
        limit: 20,
        next,
      },
    })
      .then((res) => {
        this.setState({
          posts: this.state.posts
            ? this.state.posts.concat(res.data.results)
            : res.data.results,
          next: res.data.next,
          hasNext: res.data.hasNext,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const deletePost = (postId) => {
      axios({
        method: 'POST',
        data: {
          id: postId,
        },
        withCredentials: true,
        url: '/post/delete',
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState((prevState) => ({
              posts: prevState.posts.filter((post) => post._id !== postId),
            }));
          }
        })
        .catch((error) => console.log(error));
    };

    const curUsername = getUserName(
      this.props.cookies ? this.props.cookies.get('access_token') : null,
    );

    return this.state.posts ? (
      <InfiniteScroll
        dataLength={this.state.posts.length}
        next={this.fetchPosts.bind(this, this.state.next)}
        hasMore={this.state.hasNext}
        className="justify-content-center align-items-center row"
        loader={
          <div className="col-sm-12">
            <Spinner animation="border" />
          </div>
        }
        scrollThreshold="80%"
      >
        {this.state.posts.map((item) => (
          <Post
            className="col-sm"
            key={item._id}
            title={item.title}
            message={item.message}
            username={item.username}
            attachments={item.attachments}
            timestamp={item.timestamp}
            id={item._id}
            delete={item.username === curUsername}
            deleteHandler={deletePost}
            link={!!curUsername}
          />
        ))}
      </InfiniteScroll>
    ) : (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
}
export default Feed;
