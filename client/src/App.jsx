import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motd: '',
      registerUsername: '',
      registerPassword: '',
      registerEmail: '',
      registerFirstName: '',
      registerMiddleName: '',
      registerLastName: '',
      loginEmail: '',
      loginPassword: '',
      data: '',
      title: '',
      message: '',
      posts: '',
    };
  }

  componentDidMount() {
    return fetch('/api/greeting')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          motd: responseJson.motd,
        });
      });
  }

  render() {
    const { motd } = this.state;
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
    const create = () => {
      axios({
        method: "POST",
        data: {
          title: this.state.title,
          message: this.state.message,
        },
        withCredentials: true,
        url: "/post/create",
      }).then((res) => console.log(res));
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
          this.setState({data: res.data});
        })
        .catch((error) => {
          console.log(error);
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
    return (
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
      Edit 
      <code>src/App.js</code>
      and save to reload.
      </p>
      <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
      >
      Learn React
      </a>
      <p>
      Response from API: 
      {motd}
      </p>
      </header>
      <div>
      <h1>Register</h1>
      <input placeholder='username' onChange={e => this.setState({registerUsername: e.target.value})}></input>
      <input placeholder='password' onChange={e => this.setState({registerPassword: e.target.value})}></input>
      <input placeholder='email' onChange={e => this.setState({registerEmail: e.target.value})}></input>
      <input placeholder='first name' onChange={e => this.setState({registerFirstName: e.target.value})}></input>
      <input placeholder='last name' onChange={e => this.setState({registerLastName: e.target.value})}></input>
      <input placeholder='middle name' onChange={e => this.setState({registerMiddleName: e.target.value})}></input>
      <input placeholder='last name' onChange={e => this.setState({registerLastName: e.target.value})}></input>
      <button onClick={register}>Submit</button>
      </div>
      <div>
      <h1>Login</h1>
      <input placeholder='email' onChange={e => this.setState({loginEmail: e.target.value})}></input>
      <input placeholder='password' onChange={e => this.setState({loginPassword: e.target.value})}></input>
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
      <div>
      <h1>Create Post</h1>
      <input placeholder='Title' onChange={e => this.setState({title: e.target.value})}></input>
      <input placeholder='Message' onChange={e => this.setState({message: e.target.value})}></input>
      <button onClick={create}>Submit</button>
      </div>
      <div>
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
      </div>
    );
  }
}


export default App;
