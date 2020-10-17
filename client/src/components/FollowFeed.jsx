import React, { Component } from 'react';
import axios from 'axios';
import {CardColumns} from 'react-bootstrap';
import Post from './post'

class FollowFeed extends Component {
    

    state = {
        posts: ''
    }
    componentDidMount(){
        return axios({
            method: "GET",
            withCredentials: true,
            url: "/post/follow_feed",
        })
        .then((res) => {
            this.setState({posts: res.data});
            console.log(this.state.users);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render(){

        return(
            <div>
                <h1>followed feed</h1>
                <CardColumns>
                { this.state.posts ? this.state.posts.map((item) => {
                    return(
                        <Post title={item.title} message={item.message} auhtor='temp' attachments={item.attachments} id={item._id}/>
                    )}) : null
                }
                </CardColumns>
            </div>
        );
     }
}
export default FollowFeed;