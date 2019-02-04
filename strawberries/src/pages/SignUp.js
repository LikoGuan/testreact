import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Alert from 'react-s-alert';

import SignUpForm from '../forms/SignUp';
import api from '../api';

class SignUp extends Component {
  constructor() {
    super();
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }
  async onSubmit(form) {
    const { history } = this.props;
    try {
      const { data } = await api.me.signup(form);
      if (data.code === 0) {
        Alert.success(
          'We just sent you an email.  Please click on the link inside that email to verify your email address.'
        );
        history.push('/login');
      } else {
        Alert.warning(`Failed to sign up: ${data.message}:[${data.code}]`);
      }
    } catch (e) {
      Alert.warning(`Failed to sign up`);
      throw e;
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1">
          <h2 className="lat-login-title">Join Latipay </h2>
          <SignUpForm onSubmit={this.onSubmit} />
        </div>
      </div>
    );
  }
}

export default withRouter(SignUp);
