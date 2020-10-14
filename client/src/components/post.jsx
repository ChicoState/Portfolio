import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import  axios from 'axios';
import '../App.css';

class Post extends Component {
  state = {
    image_formats: new Set(["apng", "bmp", "gif", "ico", "cur", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "tif", "tiff", "webp"]),
    audio_formats: new Set(["mp3", "mpeg", "wav"]),
    video_formats: new Set(["mp4", "ogg", "webm"]),
  }


  render(){

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

          let attachment = <div></div>;
          if (this.props.attachments[0]) {
            if (this.state.image_formats.has(this.props.attachments[0].split('.').pop().toLowerCase())) {
              attachment = <Card.Img variant="top" src={'/attachment/' + this.props.attachments[0]}/>;
            } else if (this.state.audio_formats.has(this.props.attachments[0].split('.').pop().toLowerCase())) {
              attachment = 
                <audio controls src={'/attachment/' + this.props.attachments[0]}>
                Your browser does not support the <code>audio</code> element.
                </audio>;
            } else if (this.state.video_formats.has(this.props.attachments[0].split('.').pop().toLowerCase())) {
              attachment =
                <video controls src={'/attachment/' + this.props.attachments[0]}>
                Your browser does not support the
                <code>video</code> element.
                </video>;
            }
          }

    return(
      <Card className="Post">
        <Card.Header>
          {attachment}
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.props.title}</Card.Title>
          <Card.Text>{this.props.message}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Stinky Monke</small>
          <Button variant="secondary" onClick={() => deletePost(this.props.id)}>Delete</Button>
        </Card.Footer>
      </Card>
    );
  }
}

export default Post;
