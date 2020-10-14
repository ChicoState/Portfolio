import React, { Component } from 'react';
import axios from 'axios';

class Post extends Component {
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
    const create = () => {
      const postData = new FormData();
      if (this.state.selectedFile) {
        postData.append(
          "attachment",
          this.state.selectedFile,
          this.state.selectedFile.name
        );
        console.log(postData);
      }
      postData.append('title', this.state.title);
      postData.append('message', this.state.message);
      axios({
        method: "POST",
        data: postData,
        headers: {
          'content-type': 'multipart/form-data'
        },
        withCredentials: true,
        url: "/post/create",
      }).then((res) => {
        if(res.status === 200){
          getPosts();
        }
      })
        .catch((error) => console.log(error));
    };
    const deletePost = (postid) => {
      axios({
        method: "POST",
        data: {
          id: postid,
        },
        withCredentials: true,
        url: "/post/delete",
      }).then((res) => {
        if (res.status === 200) {
          this.setState(prevState => ({
            posts: prevState.posts.filter(post => post._id !== postid)
          }));
        }
      })
        .catch((error) => console.log(error));
    };
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
      <div>
      <h1>Create Post</h1>
      <input placeholder='Title' onChange={e => this.setState({title: e.target.value})}></input>
      <input placeholder='Message' onChange={e => this.setState({message: e.target.value})}></input>
      <input type="file" onChange={this.onFileChange} />
      <button onClick={create}>Submit</button>
      <h1>Get Posts</h1>
      <button onClick={getPosts}>Submit</button>
      <ul>
      {
        this.state.posts ? this.state.posts.map((item) => {
          let attachment = <div></div>;
          if (item.attachments[0]) {
            if (this.state.image_formats.has(item.attachments[0].split('.').pop().toLowerCase())) {
              attachment = <img src={'/attachment/' + item.attachments[0]}></img>;
            } else if (this.state.audio_formats.has(item.attachments[0].split('.').pop().toLowerCase())) {
              attachment = 
                <audio controls src={'/attachment/' + item.attachments[0]}>
                Your browser does not support the <code>audio</code> element.
                </audio>;
            } else if (this.state.video_formats.has(item.attachments[0].split('.').pop().toLowerCase())) {
              attachment =
                <video controls src={'/attachment/' + item.attachments[0]}>
                Your browser does not support the
                <code>video</code> element.
                </video>;
            }
          }
          return(
            <li key={item._id}>
            {item.title}
            {item.message}
            {attachment}
            <button type="button" onClick={() => deletePost(item._id)}>Delete</button>
            </li>);
        }) : null
      }
      </ul>
      </div>
    )
  }
}

export default Post;
