import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

class CreatePost extends Component {
  state = {
    title: '',
    message: '',
    tags: ['Other'],
    selectedFile: null,
    uploading: false,
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  

  render() {

    const create = () => {
      const postData = new FormData();
      if (this.state.selectedFile) {
        postData.append(
          'attachment',
          this.state.selectedFile,
          this.state.selectedFile.name
        );
        console.log(postData);
      }
      postData.append('title', this.state.title);
      postData.append('message', this.state.message);
      postData.append('tags', this.state.tags)
      this.setState({ uploading: true });
      axios({
        method: 'POST',
        data: postData,
        headers: {
          'content-type': 'multipart/form-data',
        },
        withCredentials: true,
        url: '/post/create',
      })
        .then(() => {
          this.props.handleCreate();
          this.setState({uploading: false, title: '', message: '', selectedFile: null});
          ReactDOM.findDOMNode(this.form).reset()
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return (
      <Container className="col-6">
        <Form ref={form => { this.form = form; } }>
          <Form.Group controlId="formPostTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Enter title"
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formPostMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows="4"
              placeholder="Enter message"
              onChange={(e) => this.setState({ message: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
          <Form.Label>Tags</Form.Label>
            <Form.Control
              as = "textarea"
              rows = "4"
              placeholder="Ex: Art, Photography, Music, Video"
              onChange={(e) => this.setState({ tags: e.target.value })}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.File
              id="formPostFile"
              onChange={this.onFileChange}
              label="Optional file upload"
            />
            {this.state.uploading ? (
              <Spinner animation="border" />
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  create();
                }}
              >
                Post
              </Button>
            )}
          </Form.Group>
        </Form>
      </Container>
    );
  }
}

export default CreatePost;
