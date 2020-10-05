import React, { Component } from 'react';
import axios from 'axios';
import '../App.css';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerUsername: '',
            registerPassword: '',
            registerEmail: '',
            registerFirstName: '',
            registerMiddleName: '',
            registerLastName: ''
        };
    }

    render() {
        const register = () => {
            axios.post('/user/register', {
                registerUsername: this.state.registerUsername,
                registerPassword: this.state.registerPassword,
                registerEmail: this.state.registerEmail,
                registerFirstName: this.state.registerFirstName,
                registerMiddleName: this.state.registerMiddleName,
                registerLastName: this.state.registerLastName,
            }).then(res => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
            }).catch(error => {
                console.error(error)
            })
        };

        return(
            <div className="signup">
                <h1>Register</h1>
                <input placeholder='username' onChange={e => this.setState({registerUsername: e.target.value})}></input>
                <input placeholder='password' onChange={e => this.setState({registerPassword: e.target.value})}></input>
                <input placeholder='email' onChange={e => this.setState({registerEmail: e.target.value})}></input>
                <input placeholder='first name' onChange={e => this.setState({registerFirstName: e.target.value})}></input>
                <input placeholder='middle name' onChange={e => this.setState({registerMiddleName: e.target.value})}></input>
                <input placeholder='last name' onChange={e => this.setState({registerLastName: e.target.value})}></input>
                <button onClick={register}>Submit</button>
            </div>
            
        );
    }
}

export default SignUp;