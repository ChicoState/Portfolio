import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';



class Login extends Component {
  state = {
    email: "",
    password: "",
    show: true,
  }

  render() {
    //const [show, setShow] = useState(false);

    const handleClose = () => { this.setState({ show: false }); this.props.history.push('./') };


    const loginUser = () => {
      axios({
        method: "POST",
        data: {
          email: this.state.email,
          password: this.state.password
        },
        withCredentials: true,
        url: "/user/login",
      }).then((res) => console.log(res)).catch(error => {
        console.error(error)
      });
    };
    return (
      <div>
        <Modal show={this.state.show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control placeholder="Email" onChange={e => this.setState({ email: e.target.value })} />
                <Form.Label>Password</Form.Label>
                <Form.Control placeholder="Password" type="password" onChange={e => this.setState({ password: e.target.value })} />
              </Form.Group>
              <Button type="submit" onClick={() => { loginUser(); handleClose() }}>Submit</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

export default Login;