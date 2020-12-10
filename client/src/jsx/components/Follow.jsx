import React, { Component } from 'react'
import axios from 'axios';

export default class Follow extends Component {
    state = {
        users: '',
    }
    componentDidMount() {
        return axios({
            method: "GET",
            withCredentials: true,
            url: "/user/following",
        })
        .then((res) => {
            this.setState({users: res.data});
        })
        .catch((error) => {
            console.log(error);
        });
    }
    render() {
        const getFollowing = () => {
            axios({
                method: "GET",
                withCredentials: true,
                url: "/user/following",
            })
            .then((res) => {
                this.setState({users: res.data});
                console.log(this.state.users);
            })
            .catch((error) => {
                console.log(error);
            });
        };

        const unfollowUser = (user_id) => {
            axios({
                method: "POST",
                withCredentials: true,
                url: "/user/unfollow",
                data:{
                    follow_user_id: user_id,
                }
            })
            .then((res) => {
                getFollowing();
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
                    return <li key={item._id}>{item.username} {item.first_name} {item.last_name}<button type="button" onClick={() => unfollowUser(item._id)}>Unfollow</button></li>;
                    }) : null
                }
                </ul>
            </div>
        )
    }
}
