import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from 'react-toolbox/lib/app_bar/AppBar';
import Navigation from 'react-toolbox/lib/navigation/Navigation';
import Button from 'react-toolbox/lib/button/Button';
import { actions as authActions } from '../redux/ducks/auth';

class Appbar extends Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }
  onLogout() {
    this.props.AuthTokenInvalid();
  }
  render() {
    let { admins } = this.props.constants.lookups;
    return (
      <AppBar title="Latipay Trader" leftIcon="menu">
        <Navigation type="horizontal">
          <NavLink activeClassName="selected" to="/orgs">
            Organisations
          </NavLink>
          <NavLink activeClassName="selected" to="/transactions">
            Transactions
          </NavLink>
          <NavLink activeClassName="selected" to="/settlements">
            Settlements
          </NavLink>
          <NavLink activeClassName="selected" to="/tasks?assignedUserEmail=Any&status=ASSIGNED,IGNORED,CREATED">
            Tasks
          </NavLink>
          <NavLink activeClassName="selected" to="/logs">
            Logs
          </NavLink>
          <NavLink activeClassName="selected" to={'/admin/' + (admins[0] && admins[0].id)}>
            {admins[0] && admins[0].email}
          </NavLink>
        </Navigation>
        <Button onClick={this.onLogout} icon="exit_to_app" label="Logout" raised primary />
      </AppBar>
    );
  }
}
export default connect(({ auth, constants }) => ({ auth, constants }), { ...authActions })(Appbar);
