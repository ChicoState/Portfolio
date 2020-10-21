import React, { Component } from 'react';
import { Button, CardColumns, Spinner } from 'react-bootstrap';
import Post from './Post';
import axios from 'axios';
import '../../css/post.css';
import CreatePost from './CreatePost'

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
    }

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


    return(
      <div>
        <CreatePost handleCreate={getPosts}/>
        <CardColumns className="card-columns">
      <Button variant="primary" onClick={getPosts}>Get Posts</Button>
       { this.state.posts ? this.state.posts.map((item, index) => {
          return(
            <Post key={index} title={item.title} message={item.message} username={item.username} attachments={item.attachments} id={item._id} deleteHandler={deletePost}/>
          )}) : <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
       }
      </CardColumns>

      </div>
      
    )
  }
}
export default DisplayPost;