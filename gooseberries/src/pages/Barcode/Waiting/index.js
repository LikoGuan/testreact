import React, { Component } from 'react';
import { BeatLoader } from 'react-spinners';
import numeral from 'numeral';

import scannerIcon from '../../../assets/ic_scanner.svg';
import api from '../../../api';
import { CURRENCIES_CODE_SIGN } from '../../../constants';

import './index.css';

const polling_interval = 1500;

class Modal extends Component {
  valueBuffer = [];
  timeoutId;
  visible = false;

  constructor(props) {
    super(props);

    this.state = {
      orderId: null,
      loadingResult: false
    };

    this.queryOrder = this.queryOrder.bind(this);
    this.listener = this.listener.bind(this);
  }

  clearListner = () => {
    this.valueBuffer = [];
    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
  };

  listener(e) {
    //probably barcode scanner
    const { loadingResult } = this.state;
    if (
      (e.target.className === 'barcode-btn' || e.target.nodeName === 'BODY') &&
      this.visible &&
      !loadingResult
    ) {
      //return key
      if (e.keyCode === 13) {
        //wechat 18, alipay 32
        const codeScaned = this.valueBuffer.join('');
        if (this.valueBuffer.length >= 18) {
          this.onSendRequest(codeScaned);
        } else {
          alert(
            `The code scanned ${codeScaned} is invalid, the legnth is ${
              codeScaned.length
            }, but expected at least 18.`
          );
        }

        this.clearListner();
      } else {
        const char = String.fromCharCode(e.which);
        this.valueBuffer.push(char);

        if (!this.timeoutId) {
          this.timeoutId = setTimeout(this.clearListner, 1000);
        }
      }

      e.preventDefault();
    }
  }

  componentDidMount() {
    this.visible = true;
    document.addEventListener('keypress', this.listener);
  }

  componentWillUnmount() {
    this.visible = false;
    document.removeEventListener('keypress', this.listener);
  }

  onSendRequest = async pay_code => {
    if (this.timeout) {
      //querying order
      window.clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.setState({
      loadingResult: true
    });

    const payload = this.props.data;

    // amount, user_id, wallet_id, merchant_reference,
    const { data } = await api.transaction.payBarcode({
      user_id: payload.user_id,
      wallet_id: payload.wallet_id,
      amount: payload.amount,
      merchant_reference: payload.merchant_reference,
      pay_code
    });

    if (!data || data.code !== 0) {
      this.setState({
        loadingResult: false
      });
      alert(data.message || 'Transaction failed');
      return;
    }

    this.setState(
      {
        orderId: data.orderId
      },
      () => {
        this.timeout = setTimeout(this.queryOrder, polling_interval);
      }
    );
  };

  async queryOrder() {
    const { orderId } = this.state;
    if (!orderId) return;

    const { data } = await api.transaction.query(orderId);

    const { status } = data; //TODO message

    if (status === 'pending') {
      if (this.timeout) {
        window.clearTimeout(this.timeout);
        this.timeout = setTimeout(this.queryOrder, polling_interval);
      }
    } else if (status === 'paid') {
      this.props.onSuccess(data);
    } else {
      this.setState({
        loadingResult: false,
        orderId: null
      });
      alert('Payment failed, please try again.');
    }
  }

  render() {
    const { loadingResult } = this.state;
    const { data } = this.props;
    const { amount, currencyString, walletName } = data;

    return (
      <div className="barcode-modal">
        <div className="barcode-modal-card">
          <div className="barcode-modal-head-container">
            <div className="barcode-modal-head">
              <h2 className="barcode-modal__title">Scan to pay</h2>
              <button
                className="barcode-modal__cancel"
                onClick={this.props.onCancel}
              >
                Cancel
              </button>
            </div>

            <p className="barcode-modal__wallet">to {walletName}</p>
          </div>

          <p className="barcode-modal__amount">
            <span className="barcode-modal__amount--last">
              {CURRENCIES_CODE_SIGN[currencyString]}{' '}
              {numeral(amount).format('0,0.00')}
            </span>{' '}
            {currencyString}
          </p>

          <div>
            <img
              className="barcode-modal-scanner"
              src={scannerIcon}
              alt="scanner"
            />
            <div className="barcode-modal-scanner__spinner">
              {loadingResult && (
                <BeatLoader color="#09bb07" loading={loadingResult} />
              )}
            </div>

            <p className="barcode-modal-warnning">
              Please keep this window on top when scanning.
            </p>
          </div>

          <div className="barcoe-modal-links">
            <a href="/how-to-display-barcode-in-alipay-app" target="__blank">
              How to dispaly Payment Barcode in Alipay app?
            </a>
            <br />
            <a href="/how-to-display-barcode-in-wechat-app" target="__blank">
              How to dispaly Payment Barcode in Wechat app?
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
