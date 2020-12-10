import React, { Component } from 'react';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';

class GetUserClass extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            data: ""
        }
    }

    render(){

        const getUser = () => {
            axios({
                method: "GET",
                withCredentials: true,
                url: "/user/authenticated",
            })
            .then((res) => {
                this.setState({ data: res.data });
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
        };

        return(
            <Container>
            <h1>Get User</h1>
            <Button variant="primary" onClick={getUser}>Get User</Button>
            {this.state.data ? <h1>Welcome Back {this.state.data.user.username}</h1> : null}
            </Container>
            );
     }
    
}
export default GetUserClass;
