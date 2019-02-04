import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import * as formValidations from './formValidations';
import { renderInput, renderSelect } from './Fields';
import { CURRENCIES } from '../constants';

const validators = formValidations.createValidator({
  accountCode: [formValidations.required],
  bankAccountId: [formValidations.required],
  amount: [formValidations.required, formValidations.greaterThan(0)],
  reference: [formValidations.maxLength(18)]
});

class WithdrawalForm extends Component {
  constructor() {
    super();
    this.setAmount = this.setAmount.bind(this);
  }
  componentDidMount() {
    if (this.props.withdrawAccountCode) {
      this.props.change('accountCode', this.props.withdrawAccountCode);
      this.setAmount({}, this.props.withdrawAccountCode);
    }
  }
  setAmount(event, newValue) {
    const { wallets = [] } = this.props;
    const amount =
      wallets.find(wallet => wallet.accountCode === newValue).amount || 0;
    this.props.change('amount', amount);
    this.props.change('bankAccountId', '');
  }
  render() {
    const {
      handleSubmit,
      submitting,
      bankaccounts = [],
      wallets = [],
      accountCode
    } = this.props;
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
          value={this.props.withdrawAccountCode}
          onChange={this.setAmount}
        />
        {!!accountCode && (
          <Field
            id="bankAccountId"
            name="bankAccountId"
            component={renderSelect}
            options={bankaccounts
              .filter(
                bankaccount =>
                  bankaccount.currency ===
                  wallets.find(wallet => wallet.accountCode === accountCode)
                    .currency
              )
              .map(
                ({ bankAccountId, registerBank, accountNumber, currency }) => ({
                  value: bankAccountId,
                  text: `${registerBank} | ${accountNumber} | ${
                    CURRENCIES[currency].code
                  }`
                })
              )}
            label="Bank account"
          />
        )}
        {bankaccounts.length === 0 && (
          <Link className="text-warning" to="/setting">
            Add more bank accounts
          </Link>
        )}
        <Field
          id="amount"
          name="amount"
          type="number"
          step="any"
          component={renderInput}
          label="Amount"
        />
        <Field
          id="reference"
          name="reference"
          type="text"
          component={renderInput}
          label="Reference"
          maxLength="18"
        />

        <button
          type="submit"
          className="btn btn-primary "
          disabled={submitting}
        >
          Submit
        </button>
      </form>
    );
  }
}

const selector = formValueSelector('withdrawal');
export default connect(state => ({
  accountCode: selector(state, 'accountCode'),
  bankaccounts: state.bankaccounts.data.filter(
    bankaccount => bankaccount.status === 1
  ),
  wallets: state.wallets.data.filter(wallet => !wallet.disabled)
}))(
  reduxForm({
    form: 'withdrawal',
    validate: validators
  })(WithdrawalForm)
);
