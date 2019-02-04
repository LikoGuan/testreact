// @flow
import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import history from './history';
import Login from './pages/Login';
import Main from './pages/Main';

import HowAlipay from './pages/Barcode/HowAlipay';
import HowWechat from './pages/Barcode/HowWechat';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/login/:company" component={Login} />

          <Route
            path="/how-to-display-barcode-in-alipay-app"
            component={HowAlipay}
          />
          <Route
            path="/how-to-display-barcode-in-wechat-app"
            component={HowWechat}
          />
          <PrivateRoute path="/" component={Main} />
        </Switch>
      </Router>
    );
  }
}

export default App;
