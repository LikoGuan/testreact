import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import theme from './toolbox/theme';
import PrivateRoute from './components/PrivateRoute';
import Notification from './components/Notification';

import './toolbox/theme.css';

import history from './history';
import Main from './pages/Main';
import Login from './pages/Login';

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Router history={history}>
            <Switch>
              <Route path="/login" component={Login} />
              <PrivateRoute path="/" component={Main} />
            </Switch>
          </Router>
          <Notification />
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
