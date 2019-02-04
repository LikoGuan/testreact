import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, FieldArray, formValueSelector } from 'redux-form';

import * as formValidations from './formValidations';
import { renderInput, renderSelect, renderCheckbox } from './Fields';
import FileList from './FileList';
import { CURRENCIES } from '../constants';
import normalizeBankAccount from './normalizeBankAccount';

const validators = formValidations.createValidator({
  accountName: [formValidations.required, formValidations.maxLength(100)],
  currency: [formValidations.required],
  registerBank: [formValidations.required, formValidations.maxLength(100)],
  accountNumber: [formValidations.required, formValidations.maxLength(100)],
  files: [formValidations.required]
});

class BankAccountForm extends React.Component {
  componentWillReceiveProps({ currency: newCurrency }) {
    const { accountNumber, currency: oldCurrency, change } = this.props;

    if (newCurrency !== oldCurrency && accountNumber) {
      if (
        CURRENCIES[newCurrency].code === 'NZD' ||
        CURRENCIES[newCurrency].code === 'AUD'
      ) {
        change(
          'accountNumber',
          normalizeBankAccount(newCurrency)(accountNumber)
        );
      } else if (accountNumber.indexOf('-') !== -1) {
        const onlyNums = accountNumber.replace(/[^\d]/g, '');
        change('accountNumber', onlyNums);
      }
    }
  }

  render() {
    const { handleSubmit, submitting, currency } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          id="accountName"
          name="accountName"
          type="text"
          component={renderInput}
          label="Bank account name"
        />
        <Field
          id="registerBank"
          name="registerBank"
          type="text"
          component={renderInput}
          label="Bank name"
        />
        <Field
          id="currency"
          name="currency"
          component={renderSelect}
          options={Object.keys(CURRENCIES)
            .filter(item => CURRENCIES[item].code !== 'CNY')
            .map(key => ({
              value: +key,
              text: CURRENCIES[key].code
            }))}
          label="Currency"
        />
        <Field
          id="accountNumber"
          name="accountNumber"
          type="text"
          component={renderInput}
          label="Bank account number"
          normalize={normalizeBankAccount(currency)}
        />
        <Field
          id="isDefault"
          name="isDefault"
          component={renderCheckbox}
          label="Set as default account for the selected currency"
        />
        <FieldArray
          name="files"
          component={FileList}
          title="Add Bank Statement"
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

const selector = formValueSelector('bankaccount');

export default connect(state => ({
  currency: selector(state, 'currency'),
  accountNumber: selector(state, 'accountNumber')
}))(
  reduxForm({
    form: 'bankaccount',
    validate: validators
  })(BankAccountForm)
);
