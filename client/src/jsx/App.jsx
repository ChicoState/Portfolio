import React, { Component } from 'react';
import NavigationBar from './components/NavigationBar';
import '../css/App.css';
import Routes from './routes/routes';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
//import CreatePost from './components/createPost';
/*
import UpdateName from './components/UpdateName';
import UpdatePassword from './components/UpdatePassword';
import GetUserClass from './components/GetUser';
import RecommendedFeed from './components/RecommendedFeed';
import DisplayPost from './components/DisplayPost';
import FollowFeed from './components/FollowFeed';
import Unfollow from './components/Unfollow';
*/

class App extends Component {
  render() {
    return (
      <div className="content" style={{height: "101vh"}}>
        <NavigationBar cookies={this.props.cookies} location={this.props.location}/>
        <Routes cookies={this.props.cookies}/>
      </div>
    );
  }
}

export default withCookies(withRouter(App));
