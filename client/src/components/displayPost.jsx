import React, { Component } from 'react';
import { Button, CardColumns } from 'react-bootstrap';
import Post from './post';
import axios from 'axios';
import './post.css';

class DisplayPost extends Component {
    state = {
    data: '',
    title: '',
    message: '',
    posts: '',
    image_formats: new Set(["apng", "bmp", "gif", "ico", "cur", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "tif", "tiff", "webp"]),
    audio_formats: new Set(["mp3", "mpeg", "wav"]),
    video_formats: new Set(["mp4", "ogg", "webm"]),
    selectedFile: null
    }
    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };


  render(){
    const getPosts = () => {
      axios({
        method: "POST",
        withCredentials: true,
        url: "/post/view",
      })
        .then((res) => {
          this.setState({posts: res.data});
        })
        .catch((error) => {
          console.log(error);
        });
    };


    return(
      <CardColumns className="card-columns">
      <Button variant="primary" onClick={getPosts}>Get Posts</Button>
       { this.state.posts ? this.state.posts.map((item) => {
          return(
            <Post title={item.title} message={item.message} author='temp' attachments={item.attachments} id={item._id} />
          )}) : null
       }
      </CardColumns>
    )
  }
}
export default DisplayPost;