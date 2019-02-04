import React, { Component } from 'react';

import Me from './Me';
import Org from './Org';
import Users from './Users';
import BankAccounts from './BankAccounts';
// import Customers from './Customers';

class Account extends Component {
  render() {
    return (
      <div className="lat-content">
        <h1 className="lat-greeting">Account details</h1>
        <div className="row">
          <div className="col-sm-6">
            <Me />
          </div>
          <div className="col-sm-6">
            <Org />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <Users />
          </div>
          <div className="col-sm-6">
            <BankAccounts />
          </div>
        </div>
        {/* <div className="row">
          <div className="col-sm-6">
            <Customers />
          </div>
          <div className="col-sm-6" />
        </div> */}
      </div>
    );
  }
}

export default Account;
