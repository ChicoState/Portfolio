import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Button, Form, Container} from 'react-bootstrap';

class Login extends Component {
  state = {
    email: "",
    password: "",
  }

  render() {
    const next = () => {this.props.history.replace(this.props.location.state ? this.props.location.state.from.pathname : '/');}

    const login = () => {
      axios({
        method: "POST",
        data: {
          email: this.state.email,
          password: this.state.password
        },
        withCredentials: true,
        url: "/user/login",
      }).then((res) => {next();}).catch(error => {
        console.error(error)
      });
    };
    
    return (
      <Container>
            <h1>Login</h1>
            <Form>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control placeholder="Email" onChange={e => this.setState({ email: e.target.value })} />
                <Form.Label>Password</Form.Label>
                <Form.Control placeholder="Password" type="password" onChange={e => this.setState({ password: e.target.value })} />
              </Form.Group>
              <Button onClick={() => { login(); }}>Submit</Button>
            </Form>
          
      </Container>
    );
  }
};

export default withRouter(Login);