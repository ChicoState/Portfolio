import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { getUserName } from './Authentication';
import PendingFollowers from './PendingFollowers';
import axios from 'axios';

class FollowButton extends Component {
    state = {
        followStatus: null,
        visibility: null,
    };

    getFollowState(followeeUsername) {
        axios({
            method: "GET",
            withCredentials: true,
            url: "/user/follow_status",
            params: {
                followee_username: followeeUsername,
            }
        })
            .then((res) => {
                console.log(res);
                this.setState({ followStatus: res.data.follow_status,
                    visibility: res.data.visibility });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    followUser(followeeUsername) {
        axios({
            method: "PUT",
            withCredentials: true,
            url: "/user/follow",
            data: {
                followee_username: followeeUsername
            }
        })
            .then((res) => {
                this.setState({ followStatus: res.data.follow_status });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    togglePublic(username) {
        axios({
            method: "PUT",
            withCredentials: true,
            url: "/user/visibility",
            data: {
                username: username
            }
        })
            .then((res) => {
                this.setState({ visibility: res.data.visibility });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    componentDidMount() {

        this.getFollowState(this.props.pageUsername);
    }

    render() {


        let pageUser = getUserName(this.props.cookies.get('access_token'))
        if (this.props.pageUsername === pageUser) {
            return (
                <div>
                    <Button onClick={() => this.togglePublic(this.props.pageUsername)}>{this.state.visibility ? "Public" : "Private"}</Button>
                    <PendingFollowers cookies={this.props.cookies} pageUsername={this.props.pageUsername} />
                </div>
            );

        } else {
            return <Button onClick={() => this.followUser(this.props.pageUsername)}>{this.state.followStatus}</Button>;
        }

    }

}

export default FollowButton;
