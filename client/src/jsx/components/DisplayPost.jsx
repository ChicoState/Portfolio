import React, { Component } from 'react';
import { Spinner, Row } from 'react-bootstrap';
import Post from './Post';
import axios from 'axios';
import '../../css/post.css';
import CreatePost from './CreatePost'
import { getUserName } from './Authentication';

class DisplayPost extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: '',
        title: '',
        message: '',
        posts: '',
        image_formats: new Set(["apng", "bmp", "gif", "ico", "cur", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "tif", "tiff", "webp"]),
        audio_formats: new Set(["mp3", "mpeg", "wav"]),
        video_formats: new Set(["mp4", "ogg", "webm"]),
        selectedFile: null
      }
    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    componentDidMount(){
      return axios({
        method: "GET",
        withCredentials: true,
        url: `/post/view${this.props.username ? '/' + this.props.username : ''}`,  
      })
        .then((res) => {
          this.setState({posts: res.data});
        })
        .catch((error) => {
          console.log(error);
        });
    }

  render(){
    const getPosts = () => {
      axios({
        method: "GET",
        withCredentials: true,
        url: `/post/view${this.props.username ? '/' + this.props.username : ''}`,  
      })
        .then((res) => {
          this.setState({posts: res.data});
        })
        .catch((error) => {
          console.log(error);
        });
    };

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

    let curUsername = getUserName(this.props.cookies ? this.props.cookies.get('access_token') : null);

    return(
      <div>
        { curUsername === this.props.username ? <CreatePost handleCreate={getPosts}/> : null }
      
       { this.state.posts ? <Row className="justify-content-center align-items-center"> {this.state.posts.map((item) => {
          return(
            <Post key={item._id} title={item.title} message={item.message} username={item.username} attachments={item.attachments} timestamp={item.timestamp} id={item._id} delete={item.username === curUsername} deleteHandler={deletePost}/>
          )})} </Row> : <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
       }
      </div>
      
    )
  }
}
export default DisplayPost;