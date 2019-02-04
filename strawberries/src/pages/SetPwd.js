import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Alert from 'react-s-alert';

import SetPwdForm from '../forms/SetPwd';
import api from '../api';

class SetPassword extends Component {
  constructor() {
    super();
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }
  async componentDidMount() {
    const { nonce } = this.props.match.params;
    const { data } = await api.me.resetPwdCheckToken({ nonce });
    if (data.code) {
      Alert.warning(`${data.message}`);
    }
  }
  async onSubmit(form) {
    const { nonce } = this.props.match.params;
    const { password } = form;

    try {
      const { data } = await api.me.resetPwd({
        nonce,
        password,
      });
      if (data.code === 0) {
        Alert.success('Password  updated');
        this.props.history.push('/login');
      } else {
        Alert.warning(`Failed to update password: ${data.message}:[${data.code}]`);
      }
    } catch (e) {
      Alert.warning(`Failed to update password`);

      throw e;
    }
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-4 col-sm-offset-4">
          <h2 className="lat-login-title">Reset password</h2>
          <SetPwdForm onSubmit={this.onSubmit} />
        </div>
      </div>
    );
  }
}

export default withRouter(SetPassword);
