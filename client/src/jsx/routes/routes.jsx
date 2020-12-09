import React, { Component } from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import Home from '../components/screens/Home';
import Signup from '../components/screens/Signup';
import Login from '../components/screens/Login';
import Logout from '../components/screens/Logout';
import Profile from '../components/screens/Profile';
import Account from '../components/screens/Account';
import Discover from '../components/screens/Discovery';
import NotFound from '../components/screens/NotFound';
import { getUserName } from '../components/Authentication';

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            children={<Home cookies={this.props.cookies} />}
          />
          <Route exact path="/signup" children={<Signup />} />
          <Route exact path="/login" children={<Login />} />
          <Route exact path="/logout" children={<Logout />} />
          <Route
            exact
            path="/profile"
            render={() => (
              <Redirect
                to={
                  this.props.cookies &&
                  getUserName(this.props.cookies.get('access_token'))
                    ? `/profile/${getUserName(
                      this.props.cookies.get('access_token'),
                    )}`
                    : '/login'
                }
              />
            )}
          />
          <Route
            exact
            path="/profile/:username"
            children={<Profile cookies={this.props.cookies} />}
          />
          <Route
            exact
            path="/account"
            children={<Account cookies={this.props.cookies} />}
          />
          <Route
            exact
            path="/discovery"
            children={<Discover cookies={this.props.cookies} />}
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Routes);
