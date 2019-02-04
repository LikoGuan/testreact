// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import StaticQR from './pages/StaticQR';

import StaticQRConfirmation from './pages/StaticQRConfirmation';

import ErrorPage from './pages/Error';

class Welcome extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Welcome to Latipay StaticPay
      </div>
    );
  }
}

const history = createHistory();

export default ({ store }) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route
            path="/static_qr/:user_id/:wallet_id/:preset_amount?"
            component={StaticQR}
          />
          <Route
            path="/static_qr_confirmation"
            component={StaticQRConfirmation}
          />

          <Route path="/static_qr/error" component={ErrorPage} />

          <Route path="/" component={Welcome} />
        </Switch>
      </Router>
    </Provider>
  );
};
