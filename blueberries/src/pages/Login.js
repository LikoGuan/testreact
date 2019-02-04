import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { actions as authActions } from '../redux/ducks/auth';
import LoginForm from '../forms/Login';
import api from '../api';

class Login extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }
  async onSubmit(form) {
    const { data } = await api.me.login(form);
    if (!data.code) {
      this.props.AuthTokenIssued(data);
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const isLogin = this.props.auth.jwt;

    if (isLogin) {
      return <Redirect to={from} />;
    }
    return (
      <Grid fluid>
        <Row around="xs">
          <Col xs={12} sm={8} md={6} lg={4}>
            <h1>Latipay Trader</h1>
            <h2>Log in</h2>
            <LoginForm onSubmit={this.onSubmit} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(s => s, authActions)(Login);
