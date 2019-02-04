import React, { Component } from 'react';

import api from '../api';

const store = require('../redux/store').default;

const openMerchant = async () => {
  //href={config.backend.merchant}
  const { userId, jwt } = store.getState().auth;
  if (!userId && !jwt) {
    this.onLogout();
    return;
  }

  await api.me.redirectCORSToMerchant({ userId, jwt });
};

class Main extends Component {
  componentDidMount() {
    openMerchant();
  }

  render() {
    return (
      <div className="main">
        <p style={{ textAlign: 'center' }}>Redirecting to Merchant portal.</p>
      </div>
    );
  }
}

export default Main;
