import React, { Component } from 'react';
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
            <div>
            <h1>Update Password</h1>
            <input placeholder='Old Password' onChange={e => this.setState({old_password: e.target.value})}></input>
            <input placeholder='New password' onChange={e => this.setState({new_password: e.target.value})}></input>
            <input placeholder='New password' onChange={e => this.setState({new_password_confirm: e.target.value})}></input>
            <button onClick={update}>Submit</button>
        </div>
        )
    }
}

export default ChangePassword;