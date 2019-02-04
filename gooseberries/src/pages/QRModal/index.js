import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import numeral from 'numeral';
import { BeatLoader } from 'react-spinners';

import api from '../../api';
import wechatLogo from '../../assets/wechat.png';
import aliLogo from '../../assets/alipay-svg.svg';

import { CURRENCIES_CODE_SIGN } from '../../constants';

import './index.css';

const polling_interval = 2000;

class QRModal extends Component {
  constructor(props) {
    super(props);

    this.queryOrder = this.queryOrder.bind(this);
  }

  async queryOrder() {
    const { orderId } = this.props;
    if (this.props.loadingQr || !orderId) {
      window.clearTimeout(this.timeout);
      this.timeout = setTimeout(this.queryOrder, polling_interval);
    } else {
      const { data } = await api.transaction.query(orderId);

      const { status, message } = data;

      if (status === 'pending') {
        if (this.timeout) {
          //componentWillUnmount did not called
          window.clearTimeout(this.timeout);
          this.timeout = setTimeout(this.queryOrder, polling_interval);
        }
      } else if (status === 'paid') {
        this.props.onSuccess(data);
      } else {
        alert(message);
      }
    }
  }

  onCancel = () => {
    window.clearTimeout(this.timeout);
    this.timeout = null;

    this.props.onCancel();
  };

  componentDidMount() {
    this.timeout = setTimeout(this.queryOrder, 2000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
    this.timeout = null;
  }

  render() {
    const {
      loadingQr,
      walletName,
      currencyString,
      amount,
      paymentMethod,
      amountCNY,
      qr,
      onReload
    } = this.props;

    return (
      <div className="qr-modal">
        <div className="qr-modal-card">
          <div className="qr-modal-head-container">
            <div className="qr-modal-head">
              <h2 className="qr-modal__title">Scan to pay</h2>
              <button className="qr-modal__cancel" onClick={this.onCancel}>
                Cancel
              </button>
            </div>

            <p className="qr-modal__wallet">to {walletName}</p>
          </div>

          <p className="qr-modal__amount">
            <span className="qr-modal__amount--last">
              {CURRENCIES_CODE_SIGN[currencyString] || '$'}{' '}
              {numeral(amount).format('0,0.00')}
            </span>{' '}
            {currencyString}
            {amountCNY && (
              <span className="qr-modal__amount--cny">
                ≈ ¥{numeral(amountCNY)
                  .divide(100)
                  .format('0,0.00')}{' '}
                CNY
              </span>
            )}
          </p>

          <div>
            <p className="qr-modal__tips">
              Use {paymentMethod === 'wechat' ? 'Wechat' : 'Alipay'} App to scan
              it
            </p>
            <div className="qr-code-container" onClick={onReload}>
              <div>
                <QRCode
                  value={
                    qr ||
                    (paymentMethod === 'wechat'
                      ? 'weixin://wxpay/bizpayurl?pr=0'
                      : 'https://qr.alipay.com/ba0000000000000000000000')
                  }
                  size={200}
                  bgColor="#fff"
                />
              </div>
              {loadingQr && (
                <div className="qr-code-cover">
                  <div className="qr-spinner">
                    <BeatLoader
                      color={paymentMethod === 'wechat' ? '#09bb07' : '#149ce3'}
                      loading={loadingQr}
                    />
                  </div>
                </div>
              )}
            </div>
            <p className="qr-modal__tips">
              Tap QR code to refresh it if necessary
            </p>
          </div>

          <img
            className="qr-modal__payment"
            src={paymentMethod === 'wechat' ? wechatLogo : aliLogo}
            alt=""
          />
        </div>
      </div>
    );
  }
}

export default QRModal;
