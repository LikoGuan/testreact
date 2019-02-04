import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import store from '../../redux/store';
import Waiting from './Waiting/';
import Receipt from '../Receipt/';

import Form from './Form';

import './index.css';

class Barcode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      scanning: false,

      successResult: undefined
    };
  }

  onSubmit = form => {
    if (form.amount > 100000) return;

    //fix bug: barcode gun will change the value of these inputs
    document.getElementById('wallet_id').blur();
    document.getElementById('barcode_amount').blur();
    document.getElementById('merchant_reference').blur();

    const { wallet_id, merchant_reference } = form;

    const { defaultAccountCode, walletMaps = {} } = this.props;

    const wallet = walletMaps[defaultAccountCode] || {};

    const data = {
      amount: form.amount,
      wallet_id: wallet_id,
      user_id: this.props.profile.user_id,
      walletName: wallet.accountName,
      currencyString: wallet.currencyString
    };

    if (
      merchant_reference &&
      merchant_reference.length > 0 &&
      merchant_reference.trim().length > 0
    ) {
      data.merchant_reference = merchant_reference;
    }

    this.setState({
      data,
      scanning: true
    });
  };

  onCancel = () => {
    this.clearForm();

    this.setState(
      {
        scanning: false
      },
      () => {
        document.getElementById('barcode_amount').focus();
      }
    );
  };

  onSuccess = async data => {
    this.clearForm();

    this.setState(
      {
        scanning: false,
        successResult: data
      },
      () => {
        document.getElementById('barcode_amount').focus();
      }
    );
  };

  onNewPayment = () => {
    this.clearForm();

    this.setState(
      {
        scanning: false,
        data: {},
        successResult: undefined
      },
      () => {
        document.getElementById('barcode_amount').focus();
      }
    );
  };

  clearForm() {
    store.dispatch(reset('barcodeForm')); //clear form
  }

  render() {
    const { data, scanning, successResult } = this.state;

    return (
      <div>
        <h2 className="home-title">New Payment</h2>
        <Form onSubmit={this.onSubmit} />

        {scanning && (
          <Waiting
            data={data}
            onCancel={this.onCancel}
            onSuccess={this.onSuccess}
          />
        )}

        {successResult && (
          <Receipt
            successResult={successResult}
            onNewPayment={this.onNewPayment}
          />
        )}
      </div>
    );
  }
}

export default connect(
  ({
    data: { profile, wallets, walletMaps },
    userDefaults: { accountCode: defaultAccountCode }
  }) => ({
    profile,
    wallets,
    walletMaps,
    defaultAccountCode
  })
)(Barcode);
