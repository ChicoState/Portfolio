import React, { Component } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import  axios from 'axios';
import './post.css';

class Post extends Component {
  state = {
    image_formats: new Set(["apng", "bmp", "gif", "ico", "cur", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "tif", "tiff", "webp"]),
    audio_formats: new Set(["mp3", "mpeg", "wav"]),
    video_formats: new Set(["mp4", "ogg", "webm"]),
  }

  render(){

          let attachment = <div></div>;
          if (this.props.attachments.length > 0) {
            if (this.state.image_formats.has(this.props.attachments[0].split('.').pop().toLowerCase())) {
              attachment = <Card.Img variant="top" className="post-img" src={'/attachment/' + this.props.attachments[0]} />;
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
      <Card className="Post col-md-12">
          <Card.Header>
            {attachment}
          </Card.Header>
          <Card.Body>
            <Card.Title>{this.props.title}</Card.Title>
            <Card.Text>{this.props.message}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">{this.props.author}</small>
            <Button variant="secondary" onClick={() => this.props.deleteHandler(this.props.id)}>Delete</Button>
        </Card.Footer>
      </Card>
    );
  }
}

export default Post;
