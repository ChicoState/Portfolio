import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Routes from './routes/routes';
import { Link } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      data: '',
    };
  }

  componentDidMount() {
    return fetch('/api/greeting')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          message: responseJson.message,
        });
      });
  }
  render() {
    const { message } = this.state;
  
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
      {message}
      </p>
      </header>
        <ul>
          <li>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/signup"><button>SignUp</button></Link>
          </li>
        </ul>    
      <Routes/>
      <div>

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

export default App;
