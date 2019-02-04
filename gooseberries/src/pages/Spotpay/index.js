import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import store from '../../redux/store';
import QRModal from '../QRModal/';
import Receipt from '../Receipt/';

import Form from './Form';

import { genPayData } from '../../utils';
import api from '../../api';

import './index.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {},
      paydata: {},
      qr: '',
      successResult: undefined
      // showQrModal: true,
      // loadingQr: true
    };
  }

  onSubmit = async form => {
    const { walletMaps } = this.props;
    const wallet = walletMaps[form.wallet_id];

    if (form.amount > 100000) return;

    this.setState({
      form,
      walletName: wallet.accountName,
      currencyString: wallet.currencyString,
      showQrModal: true,
      loadingQr: true
    });

    const payData = genPayData(form, this.props.profile);

    try {
      const { data: transaction } = await api.transaction.init(payData);
      if (!transaction || transaction.code !== 0) {
        this.setState({
          showQrModal: false,
          loadingQr: false
        });

        alert(transaction.message || 'Transaction failed');
        return;
      }

      const { nonce } = transaction;
      const { data: gateway } = await api.transaction.gateway(nonce);
      if (!gateway || gateway.code !== 0) {
        this.setState({
          showQrModal: false,
          loadingQr: false
        });

        alert(gateway.message || 'Payment failed');
        return;
      }

      const { data: payment } = await api.payment.qrcode(nonce);
      if (!payment || payment.code !== 0) {
        this.setState({
          showQrModal: false,
          loadingQr: false
        });

        alert(payment.message || 'Get QR Code failed');
        return;
      }

      const { amountCNY, orderId } = gateway.paydata;
      const { code_url: wechatQRTxt, qr_code: alipayQRImgUrl } = payment;

      this.setState({
        order: {
          orderId,
          amountCNY
        },
        qr: wechatQRTxt ? wechatQRTxt : alipayQRImgUrl,
        loadingQr: false
      });
    } catch (err) {
      alert((err.response || {}).data || 'Payment failed');

      this.onCancel();
    }
  };

  onCancel = () => {
    this.clearForm();

    this.setState(
      {
        form: {},
        qr: '',

        showQrModal: false,
        loadingQr: false
      },
      () => {
        document.getElementById('amount').focus();
      }
    );
  };

  onReload = () => {
    this.onSubmit(this.state.form);
  };

  onSuccess = async data => {
    this.clearForm();

    this.setState({
      qr: '',
      showQrModal: false,
      form: {},
      successResult: data
    });
  };

  onNewPayment = () => {
    this.clearForm();

    this.setState(
      {
        qr: '',
        showQrModal: false,
        form: {},
        successResult: undefined
      },
      () => {
        document.getElementById('amount').focus();
      }
    );
  };

  clearForm() {
    store.dispatch(reset('spotpayForm')); //clear form
  }

  render() {
    const {
      walletName,
      currencyString,
      showQrModal,
      loadingQr,
      form,
      order = {},
      qr,
      successResult
    } = this.state;

    const qrProps = {
      loadingQr,

      walletName,
      currencyString,
      amount: form.amount,
      paymentMethod: form.payment_method,

      amountCNY: order.amountCNY,
      orderId: order.orderId,
      qr
    };

    return (
      <div>
        <h2 className="home-title">New Payment</h2>
        <Form onSubmit={this.onSubmit} />

        {showQrModal && (
          <QRModal
            {...qrProps}
            onCancel={this.onCancel}
            onReload={this.onReload}
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
    data: { profile, walletMaps },
    userDefaults: { accountCode: defaultAccountCode }
  }) => ({
    profile,
    walletMaps,
    defaultAccountCode
  })
)(Home);
