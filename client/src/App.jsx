import React, { Component } from 'react';
import NavigationBar from './components/navigationbar';
import SocialFeed from './components/socialfeed';
import Login from './components/login';
import SignUp from './components/signup';
import './App.css';
import Post from './components/post';
import UpdateUser from './components/updateUser';
import ChangePassword from './components/changePassword'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      motd: '',
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

    return (
      <div className="Homepage">
        <NavigationBar></NavigationBar>
        <div className="Database">
          <p>
            Response from API:
        {motd}
          </p>
        </div>
        <Login/>
        <SignUp/>
        <Post/>
        <UpdateUser/>
        <ChangePassword/>
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
