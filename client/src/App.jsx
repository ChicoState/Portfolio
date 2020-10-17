import React, { Component } from 'react';
import NavigationBar from './components/navigationbar';
import SocialFeed from './components/socialfeed';
import './App.css';
import Routes from './routes/routes';
import UpdateUser from './components/updateUser';
import ChangePassword from './components/changePassword'
import GetUserClass from './components/getUser';
import RecommendedFeed from './components/RecommendedFeed'
import DisplayPost from './components/displayPost'
import CreatePost from './components/CreatePost'
import FollowFeed from './components/FollowFeed';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      data: '',
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
        <Routes/>
        <div className="Database">
          <p>
            Response from API:
        {motd}
          </p>
        </div>
        <GetUserClass/>
        <CreatePost/>
        <DisplayPost/>
        <UpdateUser/>
        <ChangePassword/>
        <RecommendedFeed/>
        <FollowFeed/>
        <div className="container">
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              {/* <SocialFeed></SocialFeed> */}
            </div>
            <div className="col-sm-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
