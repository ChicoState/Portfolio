import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Home from '../components/screens/Home';
import Signup from '../components/screens/Signup';
import Login from '../components/screens/Login';
import Logout from '../components/screens/Logout';
import Profile from '../components/screens/Profile';
import Account from '../components/screens/Account';
import NotFound from '../components/screens/NotFound';

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" children={<Home cookies={this.props.cookies}/>} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" cookies={this.props.cookies} component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/profile" children={<Profile cookies={this.props.cookies}/>} />
          <Route exact path="/account" children={<Account cookies={this.props.cookies}/>} />
          <Route component={NotFound} />
        </Switch>
       
      </div>
    );
  }
}

export default withRouter(Routes);
