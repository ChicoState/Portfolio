import React, { Component } from 'react';
import NavigationBar from './components/navigationbar';
import SocialFeed from './components/socialfeed';
import Login from './components/login';
import SignUp from './components/signup';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
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

    return (
      <div className="Homepage">
        <NavigationBar></NavigationBar>
        <div className="Database">
          <p>
            Response from API:
        {message}
          </p>
        </div>
        <Login></Login>
        <SignUp></SignUp>
        <div className="container">
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <SocialFeed></SocialFeed>
            </div>
            <div className="col-sm-2"></div>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
