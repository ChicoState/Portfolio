import React, { Component } from 'react';
import { Button, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/post.css';

class Post extends Component {
  state = {
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
  };

  render() {
    const download = (name) => {
      axios({
        url: '/attachment/' + name,
        method: 'GET',
        responseType: 'blob', // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
      });
    };

    let title = <div></div>;
    if (this.props.title.length > 0) {
      title = (
        <Card.Title className="card-title">{this.props.title}</Card.Title>
      );
    }

    let attachment = <div></div>;
    if (this.props.attachments.length > 0) {
      if (
        this.state.image_formats.has(
          this.props.attachments[0].split('.').pop().toLowerCase()
        )
      ) {
        attachment = (
          <Card.Img
            variant="top"
            className="post-img"
            src={'/attachment/' + this.props.attachments[0]}
          />
        );
      } else if (
        this.state.audio_formats.has(
          this.props.attachments[0].split('.').pop().toLowerCase()
        )
      ) {
        attachment = (
          <audio controls preload="metadata" src={'/attachment/' + this.props.attachments[0]}>
            Your browser does not support the <code>audio</code> element.
          </audio>
        );
      } else if (
        this.state.video_formats.has(
          this.props.attachments[0].split('.').pop().toLowerCase()
        )
      ) {
        attachment = (
          <video controls preload="metadata" src={'/attachment/' + this.props.attachments[0] + "#t=0.5"}>
            Your browser does not support the
            <code>video</code> element.
          </video>
        );
      } else {
        attachment = (
          <Button
            onClick={() => {
              download(this.props.attachments[0]);
            }}
          >
            Download
          </Button>
        );
      }
    }

    let message = <div></div>;
    if (this.props.message.length > 0) {
      message = (
        <Card.Body className="card-title">
          <Card.Text className="card-text">{this.props.message}</Card.Text>
        </Card.Body>
      );
    }

    return (
      <Card className="mb-4 mx-4 shadow-sm" style={{ width: '18rem' }}>
        <Card.Header className="card-title">
          <small className="card-title text-muted float-left">
    {this.props.link ? <Link to={`/profile/${this.props.username}`}>{this.props.username}</Link> : this.props.username}
          </small>
          {this.props.delete ? (
            <div className="icon float-right">
              <svg
                onClick={() => this.props.deleteHandler(this.props.id)}
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                className="bi bi-x"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
          ) : null}
          <small className="card-title text-muted float-right">
            {new Date(this.props.timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </small>
        </Card.Header>
        {attachment}
        {title}
        {message}
      </Card>
    );
  }
}

export default Post;
