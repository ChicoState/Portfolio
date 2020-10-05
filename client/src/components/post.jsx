import React, { Component } from 'react';
import axios from 'axios';

class Post extends Component {
    state = {
        data: '',
        title: '',
        message: '',
        posts: ''
    }

    render(){
        const create = () => {
            axios({
              method: "POST",
              data: {
                title: this.state.title,
                message: this.state.message,
              },
              withCredentials: true,
              url: "/post/create",
            }).then((res) => {
                if(res.status == 200){
                    getPosts();
                }
            })
          };
          const deletePost = (postid) => {
            axios({
              method: "POST",
              data: {
                id: postid,
              },
              withCredentials: true,
              url: "/post/delete",
            }).then((res) => {
              if (res.status === 200) {
                this.setState(prevState => ({
                  posts: prevState.posts.filter(post => post._id !== postid)
                }));
              }
            });
          };
          const getPosts = () => {
            axios({
              method: "POST",
              withCredentials: true,
              url: "/post/view",
            })
              .then((res) => {
                this.setState({posts: res.data});
                console.log(this.state.posts);
              })
              .catch((error) => {
                console.log(error);
              });
          };

        return(
            <div>
                <h1>Create Post</h1>
                <input placeholder='Title' onChange={e => this.setState({title: e.target.value})}></input>
                <input placeholder='Message' onChange={e => this.setState({message: e.target.value})}></input>
                <button onClick={create}>Submit</button>
                <h1>Get Posts</h1>
                <button onClick={getPosts}>Submit</button>
                <ul>
                {
                    this.state.posts ? this.state.posts.map((item) => {
                    return <li key={item._id}>{item.title} {item.message}<button type="button" onClick={() => deletePost(item._id)}>Delete</button></li>;
                    }) : null
                }
                </ul>
            </div>
        )
    }
}

export default Post;