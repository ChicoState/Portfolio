import React, { Component } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';

class CreatePost extends Component {
    state = {
        title: '',
        message: '',
        selectedFile: null
    }

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    render() {

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
            })
            .catch((error) => console.log(error));
        };

        return (
            <Container className="col-6">
                <Form>
                    <Form.Group controlId="formPostTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control placeholder="Enter title" onChange={e => this.setState({ title: e.target.value })} />
                    </Form.Group>

                    <Form.Group controlId="formPostMessage">
                        <Form.Label>Message</Form.Label>
                        <Form.Control as="textarea" rows="4" placeholder="Enter message" onChange={e => this.setState({ message: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.File id="formPostFile" onChange={this.onFileChange} label="Optional file upload" />
                        <Button variant="primary" onClick={() => {
                            create();
                            this.props.handleCreate();
                        }}>
                            Post
                    </Button>
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}

export default CreatePost;