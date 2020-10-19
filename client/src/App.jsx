import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import NavigationBar from './components/navigationbar';
import './App.css';
import Routes from './routes/routes';
//import CreatePost from './components/CreatePost';
import UpdateUser from './components/updateUser';
import ChangePassword from './components/changePassword'
import GetUserClass from './components/getUser';
import RecommendedFeed from './components/RecommendedFeed'
import DisplayPost from './components/displayPost'
import FollowFeed from './components/FollowFeed';
import Unfollow from './components/unfollow';


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
      <Container>
        <Routes/>
        <div className="Database">
          <p>
            Response from API:
        {motd}
          </p>
        </div>
        <Container className="col-md-8">
          <DisplayPost/>
        </Container>
        <GetUserClass/>
        <UpdateUser/>
        <ChangePassword/>
        <RecommendedFeed/>
        <Unfollow/>
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
      </Container>
      </div>
    );
  }
}

export default App;
