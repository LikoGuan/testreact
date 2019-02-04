import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Alert from "react-s-alert";
import { actions as authActions } from "../redux/ducks/auth";
import LoginForm from "../forms/Login";

import api from "../api";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(form) {
    const { data } = await api.me.login(form);
    const { jwt, userId, code, message } = data;
    if (code === 0) {
      this.props.authTokenIssued({ jwt, userId });
    } else {
      if (code === 108) {
        Alert.warning(
          "We just sent you an email.  Please click on the link inside that email to verify your email address."
        );
      } else {
        Alert.warning(`Failed to login : ${message}`);
      }
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const isLogin = (this.props.auth || {}).jwt;

    if (isLogin) {
      return <Redirect to={from} />;
    }

    return (
      <div className="row">
        <div className="col-sm-4 col-sm-offset-4 col-xs-10 col-xs-offset-1">
          <h2 className="lat-login-title">Log in</h2>
          <LoginForm onSubmit={this.onSubmit} />
        </div>
      </div>
    );
  }
}
export default connect(state => state, authActions)(Login);
