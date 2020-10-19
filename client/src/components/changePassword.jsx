import React, { Component } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';

class ChangePassword extends Component {
    state = {
        old_password: '',
        new_password: '',
        new_password_confirm: ''
    }
    render(){
        const update = () => {
            axios({
                method: "PUT",
                url: '/user/update/password',
                withCredentials: true,
                data: {
                    old_password: this.state.old_password,
                    new_password: this.state.new_password,
                    new_password_confirm: this.state.new_password_confirm
                }
            })
            .then((res) => console.log(res))
            .catch((error) => console.log(error));
        }
        return (
            <Container>
            <h1>Update Password</h1>
            <Form>
                <Form.Group controlId="formOldPass">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control placeholder="Old Password" type="password" onChange={e => this.setState({old_password: e.target.value})}/>
                </Form.Group>
                <Form.Group controlId="formNewPass">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control placeholder="New Password" type="password" onChange={e => this.setState({new_password: e.target.value})}/>
                </Form.Group>
                <Form.Group controlId="formConfirmNewPass">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control placeholder="Confirm New Password" type="password" onChange={e => this.setState({new_password_confirm: e.target.value})}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={update}>
                    Update Password
                </Button>
            </Form>
        </Container>
        )
    }
}

export default ChangePassword;