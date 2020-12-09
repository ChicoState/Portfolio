import React, { Component } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';

class UpdateName extends Component {
  state = {
    first_name: '',
    middle_name: '',
    last_name: '',
    user: '',
  };
  // componentDidMount(){
  //     return axios({
  //         method: "GET",
  //         url: "/user/authenticated",
  //         withCredentials: true,
  //     })
  //     .then((res) => {
  //         this.setState({user: res.data.user})
  //     })
  //     .catch((error) => console.log(error));
  // }

  render() {
    const update = () => {
      axios({
        method: 'PUT',
        data: {
          first_name: this.state.first_name,
          middle_name: this.state.middle_name,
          last_name: this.state.last_name,
        },
        withCredentials: true,
        url: '/user/update/info',
      })
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
    };
    return (
      <Container>
        <h1>Update User Info</h1>
        <Form>
          <Form.Group controlId="formUpdateFirst">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              placeholder={this.state.user.first_name}
              onChange={(e) => this.setState({ first_name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formUpdateMiddle">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              placeholder={this.state.user.middle_name}
              onChange={(e) => this.setState({ middle_name: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formUpdateLast">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              placeholder={this.state.user.last_name}
              onChange={(e) => this.setState({ last_name: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={update}>
            Update
          </Button>
        </Form>
      </Container>
    );
  }
}

export default UpdateName;
