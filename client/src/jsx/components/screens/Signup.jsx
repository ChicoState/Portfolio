import React, { Component } from 'react';
import axios from 'axios';
import { Button, Container, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Signup extends Component {
  state = {
    registerUsername: '',
    registerPassword: '',
    registerEmail: '',
    firstregisterFirstNameName: '',
    registerMiddleName: '',
    registerLastName: '',
    show: true,
  };

  render() {
    const next = () => {
      this.props.history.replace(
        this.props.location.state
          ? this.props.location.state.from.pathname
          : '/'
      );
    };

    const register = () => {
      axios
        .post('/user/register', {
          registerUsername: this.state.registerUsername,
          registerPassword: this.state.registerPassword,
          registerEmail: this.state.registerEmail,
          registerFirstName: this.state.registerFirstName,
          registerMiddleName: this.state.registerMiddleName,
          registerLastName: this.state.registerLastName,
          show: true,
        })
        .then((res) => {
          console.log(`statusCode: ${res.statusCode}`);
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    return (
      <Container>
            <Form>
              <Form.Group controlId="formSignupUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  placeholder="Username"
                  onChange={(e) =>
                    this.setState({ registerUsername: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSignupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  placeholder="Password"
                  type="password"
                  onChange={(e) =>
                    this.setState({ registerPassword: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSignupEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder="Email"
                  onChange={(e) =>
                    this.setState({ registerEmail: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSignupFirstName">
                <Form.Label>FirstName</Form.Label>
                <Form.Control
                  placeholder="FirstName"
                  onChange={(e) =>
                    this.setState({ registerFirstName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSignupLastName">
                <Form.Label>LastName</Form.Label>
                <Form.Control
                  placeholder="LastName"
                  onChange={(e) =>
                    this.setState({ registerLastName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formSignupMiddleName">
                <Form.Label>MiddleName</Form.Label>
                <Form.Control
                  placeholder="MiddleName"
                  onChange={(e) =>
                    this.setState({ registerMiddleName: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                onClick={() => {
                  register();
                  next();
                }}
              >
                Sign up
              </Button>
            </Form>
      </Container>
    );
  }
}
export default withRouter(Signup);
