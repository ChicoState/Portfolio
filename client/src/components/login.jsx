import React, { Component } from "react";
import axios from 'axios';
import '../App.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
            data: ''
        };
    }

    render() {

        const login = () => {
            axios({
                method: "POST",
                data: {
                    email: this.state.loginEmail,
                    password: this.state.loginPassword,
                },
                withCredentials: true,
                url: "/user/login",
            }).then((res) => console.log(res));
        };

        const logout = () => {
            axios({
                method: "GET",
                withCredentials: true,
                url: "/user/logout",
            })
                .then((res) => console.log(res))
                .catch((error) => {
                    console.log(error);
                })
        };

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
                });
        };
        return (
            <div className="Login">
                <div>
                    <h1>Login</h1>
                    <input placeholder='email' onChange={e => this.setState({ loginEmail: e.target.value })}></input>
                    <input placeholder='password' onChange={e => this.setState({ loginPassword: e.target.value })}></input>
                    <button onClick={login}>Submit</button>
                </div>
                <div>
                    <h1>Get User</h1>
                    <button onClick={getUser}>Submit</button>
                    {this.state.data ? <h1>Welcome Back {this.state.data.user.username}</h1> : null}
                </div>
                <div>
                    <h1>Logout</h1>
                    <button onClick={logout}>Submit</button>
                </div>
            </div>
        );
    }
}

export default Login;