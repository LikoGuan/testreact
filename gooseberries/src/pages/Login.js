// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import api from '../api';
import { actions as authActions } from '../redux/ducks/auth';

import { H1, H2, Text, Error } from 'primitive-collections';

import LoginForm from '../forms/Login';

import logo from '../assets/logo.svg';
import Spark from '../assets/spark.svg';
const LoginContainer = styled.div`
  display: flex;
  input {
    padding: 0 10px;
    letter-spacing: 1px;
  }
`;
const LeftSide = styled.div`
  width: 35vw;
  height: 100vh;
  background: #fff;
  padding: 2em;
  position: relative;
  @media (max-width: 767px) {
    width: 100vw;
    padding: 1.5em;
  }
`;
const RightSide = styled.div`
  width: 65vw;
  height: 100vh;
  background: no-repeat center center fixed;
  background-image: url('/${props =>
    props.spark ? 'spark.png' : 'default.png'}');
  background-size: cover;
  position: relative;
  display: block;
  @media (max-width: 767px) {
    width: 0;
    display: none;
  }
`;
const FormContainer = styled.div`
  position: relative;
  top: 45%;
  transform: translate(0, -50%);
  width: 100%;
`;

const _Logo = props => <img src={logo} alt="logo" {...props} />;
const Logo = styled(_Logo)`
  width: 75px;
`;

const Description = styled.p`
  width: 60%;
  position: absolute;
  padding-bottom: 1em;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  color: #fff;
  font-size: 20px;
  font-weight: 300;
`;
const Shadow = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  background-image: linear-gradient(
    to bottom,
    transparent 0px,
    rgba(0, 0, 0, 0.47) 53%,
    black 100%
  );
`;
const CSLogo = styled.img`
  border-left: 1px solid #ccc;
  padding-left: 10px;
  width: 80px;
  margin-left: 10px;
`;
class Login extends Component {
  constructor() {
    super();
    this.state = {};
    this.onLogin = this.onLogin.bind(this);
  }
  async onLogin(form) {
    const { data } = await api.me.login(form);
    const { jwt, userId, code, message, individual } = data;
    if (code === 0) {
      if (individual) {
        this.setState({
          message: 'Spotpay does not support Individual account.'
        });
      } else {
        this.props.AuthTokenIssued({ jwt, userId });
      }
    } else {
      this.setState({
        message
      });
    }
  }
  componentDidMount() {
    const { company } = this.props.match.params;
    const href = document.querySelector('link[rel=manifest]').href;
    if (company === 'spark') {
      if (href !== '/spark-manifest.json')
        document.querySelector('link[rel=manifest]').href =
          '/spark-manifest.json';
    } else {
      if (href !== '/manifest.json')
        document.querySelector('link[rel=manifest]').href = '/manifest.json';
    }
  }
  render() {
    const { company } = this.props.match.params;
    const cs = company === 'currencyselect';
    const spark = company === 'spark';

    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const isLogin = this.props.auth.jwt;
    if (isLogin) {
      return <Redirect to={from} />;
    }
    return (
      <LoginContainer>
        <LeftSide className="login-left-side">
          <Logo className="login-hide-when-keyboad" />
          {cs && (
            <CSLogo
              src="http://www.currencyselect.com/thumbnaillarge/websiteLogo.png"
              alt="currency select"
            />
          )}
          {spark && <CSLogo src={Spark} alt="Spark" />}

          <FormContainer>
            <H1 className="login-hide-when-keyboad">
              <Text>Spotpay</Text>
            </H1>
            <H2 className="login-hide-when-keyboad">
              <Text>Merchant Login</Text>
            </H2>
            <Error>
              <Text>{this.state.message}</Text>
            </Error>
            <LoginForm onSubmit={this.onLogin} />
          </FormContainer>
        </LeftSide>
        <RightSide spark={spark}>
          <Shadow />
          <Description>
            <Text>
              An AliPay and Wechat Pay acceptance solution from LatiPay{' '}
              {spark && ' and Spark'}
              {cs && ' and Currency Select'}
            </Text>
          </Description>
        </RightSide>
      </LoginContainer>
    );
  }
}

export default connect(
  state => state,
  authActions
)(Login);
