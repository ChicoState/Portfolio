import React, { Component } from 'react';
import '../css/App.css';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import Routes from './routes/routes';
import NavigationBar from './components/NavigationBar';

class App extends Component {
  render() {
    return (
      <div className="content" style={{ height: '101vh' }}>
        <NavigationBar
          cookies={this.props.cookies}
          location={this.props.location}
        />
        <Routes cookies={this.props.cookies} />
      </div>
    );
  }
}

export default withCookies(withRouter(App));
