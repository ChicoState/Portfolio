import React, { Component } from 'react'
import axios from 'axios';

export default class RecommendedFeed extends Component {
    state = {
        users: '',
    }
    componentDidMount() {
        return axios({
            method: "GET",
            withCredentials: true,
            url: "/user/recommended",
        })
        .then((res) => {
            this.setState({users: res.data});
        })
        .catch((error) => {
            console.log(error);
        });
    }
    render() {
        const getRecommended = () => {
            axios({
                method: "GET",
                withCredentials: true,
                url: "/user/recommended",
            })
            .then((res) => {
                this.setState({users: res.data});
                console.log(this.state.users);
            })
            .catch((error) => {
                console.log(error);
            });
        };

        const followUser = (user_id) => {
            axios({
                method: "POST",
                withCredentials: true,
                url: "/user/follow",
                data:{
                    follow_user_id: user_id,
                }
            })
            .then((res) => {
                getRecommended();
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
        };

        return (
            <div>
                <ul>
                {
                    this.state.users ? this.state.users.map((item) => {
                    return <li key={item._id}>{item.username} {item.first_name} {item.last_name}<button type="button" onClick={() => followUser(item._id)}>Follow</button></li>;
                    }) : null
                }
                </ul>
            </div>
        )
    }
}
