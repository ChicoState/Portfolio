import React, { Component } from 'react';
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
            })
            .catch((error) => {
                console.log(error);
            })
        };

        return(
            <div>
            <h1>Get User</h1>
            <button onClick={getUser}>Submit</button>
            {this.state.data ? <h1>Welcome Back {this.state.data.user.username}</h1> : null}
            </div>
            );
     }
    
}
export default GetUserClass;