import React, { Component } from 'react';
import axios from 'axios';

class UpdateUser extends Component {

    state = {
        first_name: '',
        middle_name: '',
        last_name: '',
        user: ''
    }
    componentDidMount(){
        return axios({
            method: "GET",
            url: "/user/authenticated",
            withCredentials: true,
        })
        .then((res) => {
            this.setState({user: res.data.user})
        })
        .catch((error) => console.log(error));
    }

    render(){
        const update = () => {
            axios({
              method: "PUT",
              data: {
                first_name: this.state.first_name,
                middle_name: this.state.middle_name,
                last_name: this.state.last_name
              },
              withCredentials: true,
              url: "/user/update/info",
            })
            .then((res) => console.log(res))
            .catch((error) => console.log(error));
          };
        return(
            <div>
                <h1>Update User Info</h1>
                <input placeholder={this.state.user.first_name} onChange={e => this.setState({first_name: e.target.value})}></input>
                <input placeholder={this.state.user.middle_name} onChange={e => this.setState({middle_name: e.target.value})}></input>
                <input placeholder={this.state.user.last_name} onChange={e => this.setState({last_name: e.target.value})}></input>
                <button onClick={update}>Submit</button>
            </div>
        )
    }

}

export default UpdateUser;