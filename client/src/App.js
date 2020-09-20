import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      message: ""
    }
  }
  componentDidMount(){
    return fetch ("/api/greeting")
      .then((response => response.json()))
      .then((responseJson) => {
        this.setState({
          message: responseJson.message
        })
      })
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
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
            Response from API: {this.state.message}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
