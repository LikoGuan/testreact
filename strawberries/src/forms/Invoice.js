import React, { Component } from 'react';
import { Field, reduxForm, FieldArray, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import * as formValidations from './formValidations';
import { renderInput, renderSelect } from './Fields';
import FileList from './FileList';

const validators = formValidations.createValidatorWithConditions([
  {
    condition: values => values.sendnow === false,
    rules: {
      walletCode: [formValidations.required],
      amount: [
        formValidations.required,
        formValidations.amountNumber,
        formValidations.greaterThan(0),
        formValidations.smallerThan(30000)
      ],
      customerName: [formValidations.maxLength(256)],
      contactEmail: [formValidations.maxLength(50)],
      contactPhone: [
        formValidations.phoneNumber,
        formValidations.maxLength(20)
      ],
      description: [formValidations.maxLength(256)],
      reference: [formValidations.maxLength(256)]
    }
  },
  {
    condition: values => values.sendnow === true,
    rules: {
      walletCode: [formValidations.required],
      amount: [
        formValidations.required,
        formValidations.amountNumber,
        formValidations.greaterThan(0),
        formValidations.smallerThan(30000)
      ],
      customerName: [formValidations.required, formValidations.maxLength(256)],
      attachments: {
        validators: [
          formValidations.required,
          formValidations.minLength(1, 'attachment')
        ],
        isFieldArray: true
      },

      contactEmail: [formValidations.maxLength(50)],
      contactPhone: [
        formValidations.phoneNumber,
        formValidations.maxLength(20)
      ],
      description: [formValidations.maxLength(256)],
      reference: [formValidations.maxLength(256)]
    }
  }
]);
class InvoiceForm extends Component {
  componentWillReceiveProps(nextProps) {
    const { selectedWallet, wallets = [], change } = nextProps;
    if (selectedWallet) {
      const res = wallets.find(w => w.accountCode === selectedWallet);
      if (!res) {
        change('walletCode', null);
      }
    }
  }

  render() {
    const {
      handleSubmit,
      submitting,
      wallets = [],
      change,
      selectedWallet
    } = this.props;
    const wallet = wallets.find(w => w.accountCode === selectedWallet);
    const currencyString = wallet ? ` (${wallet.currencyString})` : '';
    return (
      <form onSubmit={handleSubmit}>
        <Field
          id="walletCode"
          name="walletCode"
          component={renderSelect}
          options={wallets.map(wallet => ({
            value: wallet.accountCode,
            text: wallet.accountName
          }))}
          label="Wallet"
        />
        <Field
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          component={renderInput}
          placeholder="Amount"
          label={`Amount${currencyString}`}
        />
        <Field
          id="customerName"
          name="customerName"
          type="text"
          component={renderInput}
          label="Bill to"
        />

        <div className="page-header lat-page-header">
          <h5> Customer contact details (Optional)</h5>
        </div>
        <Field
          name="contactEmail"
          type="email"
          component={renderInput}
          label="Contact email"
        />
        <Field
          name="contactPhone"
          type="text"
          component={renderInput}
          label="Contact phone number"
        />

        <div className="page-header lat-page-header">
          <h5>Invoice details (Optional)</h5>
        </div>
        <Field
          id="description"
          name="description"
          type="text"
          component={renderInput}
          label="Description"
        />
        <Field
          id="reference"
          name="reference"
          type="text"
          component={renderInput}
          label="Reference"
        />
        <div className="page-header lat-page-header">
          <h5>Attachments</h5>
        </div>
        <FieldArray
          name="attachments"
          max={3}
          component={FileList}
          size={5 * 1024 * 1024}
        />

        <div className="row">
          <div className="col-md-6">
            <button
              type="submit"
              className="btn "
              style={{ width: '100%' }}
              disabled={submitting}
              onClick={() => change('sendnow', false)}
            >
              Save for Later
            </button>
          </div>
          <div className="col-md-6">
            <button
              type="submit"
              className="btn btn-primary "
              style={{ width: '100%' }}
              disabled={submitting}
              onClick={() => change('sendnow', true)}
            >
              Send Invoice
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const selector = formValueSelector('Invoice');
export default connect(state => ({
  selectedWallet: selector(state, 'walletCode'),
  wallets: state.wallets.data.filter(wallet => wallet.disabled === 0)
}))(
  reduxForm({
    form: 'Invoice',
    validate: validators
  })(InvoiceForm)
);
