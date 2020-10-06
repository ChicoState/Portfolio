import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import SignUp from "../components/screens/signup";
import Login from "../components/screens/login";
export default class Routes extends Component {
    render() {
        return (            
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/signup" component={SignUp} />
            </Switch>
        )
    }
}