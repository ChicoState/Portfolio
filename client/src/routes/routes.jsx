import React, { Component } from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import SignUp from '../components/screens/signup';
import Login from '../components/screens/login';
import history from './history'

export default class Routes extends Component {
  render() {
    return (
        <Router history = {history} >
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={SignUp} />
            </Switch>
        </Router>
    );
  }
}
