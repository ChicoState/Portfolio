import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import NavigationBar from './components/navigationbar';
import SocialFeed from './components/socialfeed';
import './App.css';
import Routes from './routes/routes';
import CreatePost from './components/createPost';
import DisplayPost from './components/displayPost';
import UpdateUser from './components/updateUser';
import ChangePassword from './components/changePassword'
import GetUserClass from './components/getUser';

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
        <CreatePost/>
        <Container className="col-md-8">
          <DisplayPost/>
        </Container>
        <GetUserClass/>
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
      </Container>
      </div>
    );
  }
}

export default App;
