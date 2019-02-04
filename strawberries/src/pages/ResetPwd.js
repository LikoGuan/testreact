import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-s-alert';

import ResetPwdForm from '../forms/ResetPwd';

import api from '../api';

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }
  async onSubmit(form) {
    try {
      const { data } = await api.me.requestResetPwd(form);
      if (data.code === 0) {
        Alert.success('Reset password email sent');
      } else {
        Alert.warning(`Failed to reset password: ${data.message}:[${data.code}]`);
      }
    } catch (e) {
      Alert.warning(`Failed to reset password`);

      throw e;
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1">
          <h2 className="lat-login-title">Reset Password</h2>
          <ResetPwdForm onSubmit={this.onSubmit} />
          <Link to="/login" className="btn btn-primary btn-sm lat-links">
            Log in >
          </Link>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
