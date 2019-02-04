import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { actions as authActions } from '../redux/ducks/auth';
import history from '../history';

const Nav = ({ authTokenInvalid }) => {
  const logout = () => {
    authTokenInvalid();
    history.replace('/login');
  };
  return (
    <nav className="lat-nav pull-right">
      <NavLink activeClassName="selected" to="/" exact>
        Wallets
      </NavLink>

      <NavLink activeClassName="selected" to="/invoices">
        Invoices
      </NavLink>

      <NavLink activeClassName="selected" to="/coupons">
        Coupons
      </NavLink>

      <NavLink activeClassName="selected" to="/setting">
        Account
      </NavLink>
      <a onClick={logout}>Log Out</a>
      <a href="/support" style={{ color: '#d7d8dd' }} target="__blank">
        Support
      </a>
    </nav>
  );
};
export default connect(
  state => state,
  authActions
)(Nav);
