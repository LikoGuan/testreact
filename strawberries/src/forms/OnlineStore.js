import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";

import { renderSelect } from "./Fields";

class OnlineStore extends Component {
  render() {
    const {
      handleSubmit,
      wallets = [],
      accountCode,
      initialValues
    } = this.props;
    const { secretKey, userId } = initialValues;
    console.log(
      wallets,
      accountCode,
      accountCode &&
        wallets.find(wallet => wallet.accountCode === accountCode).accountCode
    );
    return (
      <form onSubmit={handleSubmit}>
        <Field
          id="accountCode"
          name="accountCode"
          component={renderSelect}
          options={wallets.map(({ accountCode, accountName }) => ({
            value: accountCode,
            text: `${accountName}`
          }))}
          label="Wallet"
        />
        <div className="lat-table">
          <table className="table  table-hover ">
            <tbody>
              <tr>
                <td>Wallet Id</td>
                <td>
                  {accountCode &&
                    wallets.find(wallet => wallet.accountCode === accountCode)
                      .accountCode}
                </td>
              </tr>
              <tr>
                <td>Website URL</td>
                <td>
                  {accountCode &&
                    wallets.find(wallet => wallet.accountCode === accountCode)
                      .websiteUrl}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="page-header lat-page-header" />
        <div className="lat-table">
          <table className="table  table-hover ">
            <tbody>
              <tr>
                <td>User Id</td>
                <td>{userId}</td>
              </tr>
              <tr>
                <td>Key</td>
                <td>{secretKey}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    );
  }
}

const selector = formValueSelector("onlinestore");
export default connect(state => ({
  accountCode: selector(state, "accountCode"),
  wallets: state.wallets.data.filter(wallet => wallet.disabled === 0)
}))(
  reduxForm({
    form: "onlinestore"
  })(OnlineStore)
);
