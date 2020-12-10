import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import Post from './Post';
import axios from 'axios';
import '../../css/post.css';
import CreatePost from './CreatePost';
import { getUserName } from './Authentication';
import InfiniteScroll from 'react-infinite-scroll-component';

class DisplayPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      title: '',
      message: '',
      posts: null,
      next: null,
      hasNext: false,
      image_formats: new Set([
        'apng',
        'bmp',
        'gif',
        'ico',
        'cur',
        'jpg',
        'jpeg',
        'jfif',
        'pjpeg',
        'pjp',
        'png',
        'svg',
        'tif',
        'tiff',
        'webp',
      ]),
      audio_formats: new Set(['mp3', 'mpeg', 'wav']),
      video_formats: new Set(['mp4', 'ogg', 'webm']),
      selectedFile: null,
    };
  }

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  fetchPosts(next) {
    return axios({
      method: 'GET',
      withCredentials: true,
      url: `/post/view${this.props.username ? '/' + this.props.username : ''}`,
      params: {
        limit: 20,
        next: next,
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

  componentDidMount() {
    this.fetchPosts(null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      this.setState({ posts: null });
      this.fetchPosts(null);
    }
  }

  render() {
    const deletePost = (post_id) => {
      axios({
        method: 'POST',
        data: {
          id: post_id,
        },
        withCredentials: true,
        url: '/post/delete',
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState((prevState) => ({
              posts: prevState.posts.filter((post) => post._id !== post_id),
            }));
          }
        })
        .catch((error) => console.log(error));
    };

    let curUsername = getUserName(
      this.props.cookies ? this.props.cookies.get('access_token') : null
    );

    return (
      <div>
        {curUsername === this.props.username ? (
          <CreatePost handleCreate={() => {this.setState({ posts: null}); this.fetchPosts(null);}} />
        ) : null}

        {this.state.posts ? (
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
            {this.state.posts.map((item) => {
              return (
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
                  link={false}
                />
              );
            })}
          </InfiniteScroll>
        ) : (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </div>
    );
  }
}

export default DisplayPost;
