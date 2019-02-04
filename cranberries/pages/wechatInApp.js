import React from 'react';
import URL from 'url-parse';
import numeral from 'numeral';

import * as api from '../client/api';
import { staticConfirmation } from '../config';
import { hideAds } from '../server/util';

// better user experience
const polling_interval = 1000;

class WechatInApp extends React.Component {
  state = {
    status: 'pending'
  };

  hasBeenRedirected = false;

  componentDidMount() {
    this.setupWechat();

    setTimeout(this.queryOrder.bind(this), polling_interval);
  }

  async queryOrder() {
    const { transaction } = this.props.url.query;
    const { orderId } = transaction.paydata;
    const data = await api.queryOrder(orderId);

    const { code, status } = data;

    if (code !== 0) {
      setTimeout(this.queryOrder.bind(this), polling_interval);
    } else {
      if (status === 'pending') {
        setTimeout(this.queryOrder.bind(this), polling_interval);
      } else {
        this.setState({
          status
        });

        this.redirectToMerchantFromNotify(data);
      }
    }
  }

  redirectToMerchantFromNotify = data => {
    const {
      status,
      currency,
      amount,
      payAmount,
      paymentMethod,
      signature,
      merchantReference,
      createDate,
      orderId,
      accountCode
    } = data;

    let { returnUrl } = data;
    returnUrl = returnUrl || staticConfirmation;

    const url = URL(returnUrl, true);
    const query = {
      ...url.query,
      merchant_reference: merchantReference,
      payment_method: paymentMethod,
      status,
      currency,
      signature,
      //文档外 额外参数
      order_id: orderId,
      createDate
    };

    if (returnUrl.indexOf('.latipay.net/static_qr_confirmation') === -1) {
      query.amount = amount;
    } else {
      query.amount = payAmount ? payAmount : amount; //优先使用payAmount
      if (hideAds(accountCode)) {
        query.noads = true;
      }
    }

    url.set('query', query);

    this.redirectToPage(url, 'from notify');
  };

  redirectToPage = (url, type) => {
    if (this.hasBeenRedirected) {
      return true;
    }

    this.hasBeenRedirected = true;

    if (location.replace) {
      api.log({
        message: `wechat in App paid success > ${type} location.replace`,
        href: url.href
      });

      location.replace(url.href);
    } else {
      api.log({
        message: `wechat in App paid success > ${type} location.href`,
        href: url.href
      });

      setTimeout(() => {
        location.href = url.href;
      }, 100);
    }
  };

  //微信取消/失败/成功， 只有static pay才自动跳转
  redirectToMerchantFromWechatJS = (returnUrl, status, type) => {
    const { transaction } = this.props.url.query;
    const { paydata } = transaction;
    const {
      orderId,
      currency,
      amount,
      paymentMethod,
      createDate,
      customerOrderId,
      accountId
    } = paydata;

    const url = URL(returnUrl, true);
    const query = {
      ...url.query,
      order_id: orderId,
      merchant_reference: customerOrderId,
      payment_method: paymentMethod,
      createDate,
      currency,
      amount: numeral(amount)
        .divide(100)
        .format('0.00'),
      status
    };

    if (hideAds(accountId)) {
      query.noads = true;
    }

    url.set('query', query);

    this.redirectToPage(url, type);
  };

  setupWechat = () => {
    const onBridgeReady = () => {
      const { wechatdata, transaction } = this.props.url.query;
      const { paydata } = transaction;
      let { returnUrl, backPageUrl, type, customerOrderId } = paydata || {};

      if (returnUrl === '' || returnUrl === undefined || returnUrl === null) {
        returnUrl = staticConfirmation;
      }

      WeixinJSBridge.invoke('getBrandWCPayRequest', wechatdata, res => {
        api.log({ message: 'WeixinJSBridge', wechatdata, res });

        //只有static pay || Invoice才自动跳转
        const isLatipayStaticPay =
          returnUrl.indexOf('.latipay.net/static_qr_confirmation') > 0;

        const isLatipayInvoice =
          type === 'Invoice' &&
          returnUrl.indexOf('.latipay.net/confirmation') > 0;

        if (isLatipayStaticPay || isLatipayInvoice) {
          const { err_msg } = res;
          const map = {
            'get_brand_wcpay_request:fail': 'failed',
            'get_brand_wcpay_request:cancel': 'cancel',
            'get_brand_wcpay_request:ok': 'paid'
          };
          const status = map[err_msg];
          if (status === 'failed' || status === 'cancel') {
            this.setState({
              status
            });

            //invoice 如果取消，继续回到invoice页面
            if (isLatipayInvoice && !backPageUrl) {
              backPageUrl = `${location.origin}/invoice/${customerOrderId}`;
            }

            if (
              backPageUrl &&
              backPageUrl.trim().length > 0 &&
              location.replace
            ) {
              //使用go(-1)的话，微信浏览器还能前进，导致201错误
              location.replace(backPageUrl);
            } else {
              this.redirectToMerchantFromWechatJS(returnUrl, status, err_msg);
            }
          } else if (status === 'paid') {
            this.setState({
              status
            });

            this.redirectToMerchantFromWechatJS(returnUrl, status, err_msg);
          }
        }
      });
    };

    if (typeof WeixinJSBridge == 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }
  };
  render() {
    const { status } = this.state;
    return (
      <div
        style={{ backgroundColor: '#eaf0f6' }}
        className="fullscreen lat-confirmation"
      >
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 314.55 117.16"
              fill="#424547"
            >
              <path d="M141.59,57.75c-.14.48-.27.94-.4,1.4-.5,1.77-.94,3.33-1.29,4.89-.33-1.87-.9-4.07-1.51-6.35l-2.94-11.06h-1.52l-3.22,11.14c-.74,2.4-1.38,4.55-1.73,6.29-.32-1.51-.79-3.35-1.28-5.28l-3.13-12.15H122.9l5.24,19.85h1.49L133,55.11c.81-2.66,1.33-4.49,1.65-6.13a60,60,0,0,0,1.44,6.12l3,11.38h1.52l6-19.85h-1.68Z" />
              <path d="M157,64.63a8.23,8.23,0,0,1-3.68.71c-3.27,0-5.16-2.19-5.2-6h10.27l0-.09a3.79,3.79,0,0,0,.06-.87,8.24,8.24,0,0,0-1-4A4.94,4.94,0,0,0,152.87,52c-3.83,0-6.4,3.08-6.4,7.68,0,4.26,2.67,7.13,6.64,7.13a9.25,9.25,0,0,0,4.44-.92l.09,0ZM152.7,53.36a3.71,3.71,0,0,1,2.77,1,5.24,5.24,0,0,1,1.27,3.6h-8.59c.31-2.18,1.67-4.65,4.55-4.65" />
              <path d="M170.53,65.34c-5.12,0-8.17-3.23-8.17-8.64,0-5.61,3.14-9,8.4-9a9.3,9.3,0,0,1,3.89.77l.73-1.28,0,0a9.83,9.83,0,0,0-4.6-.88c-6,0-10.07,4.16-10.07,10.35,0,7.45,5.07,10.1,9.4,10.1a12.88,12.88,0,0,0,5.35-1l.07,0-.71-1.23a10.68,10.68,0,0,1-4.24.84" />
              <path d="M184.37,52a5.55,5.55,0,0,0-4.65,2.58V46.31h-1.63V66.48h1.63V57.84a4,4,0,0,1,.17-1.36,4.5,4.5,0,0,1,4.1-3.06c3.24,0,3.72,2.93,3.72,4.67v8.39h1.64V58c0-5.71-4.15-6-5-6" />
              <path d="M210.37,65.25a5.46,5.46,0,0,1-1.24.11c-1.31,0-1.91-.87-1.91-2.76v-9h4V52.28h-4V49.14h-1.64v3.14h-2.36v1.37h2.36v8.7a5.11,5.11,0,0,0,.9,3.41,3,3,0,0,0,2.48,1,4.92,4.92,0,0,0,2-.36l.08,0Z" />
              <path d="M222.19,46.49a24.19,24.19,0,0,0-4.23.38l-.1,0V66.48h1.63V58.13a8.9,8.9,0,0,0,2.27.2,7.62,7.62,0,0,0,5.85-2.22,5.7,5.7,0,0,0,1.39-4,5.19,5.19,0,0,0-1.55-3.93,7.41,7.41,0,0,0-5.26-1.69m5.18,5.76c0,3-2,4.68-5.5,4.68a8.32,8.32,0,0,1-2.38-.26V48.1a13.84,13.84,0,0,1,2.65-.21c3.32,0,5.23,1.59,5.23,4.36" />
              <path d="M251.59,52.28l-3.43,9.12c-.32.82-.59,1.63-.83,2.34-.05.17-.11.33-.16.49-.28-.91-.63-1.92-.94-2.75l-3.67-9.13,0-.07h-1.74L246,65.38a1.79,1.79,0,0,1,.17.57,1.89,1.89,0,0,1-.16.56A10.91,10.91,0,0,1,243.73,70a7.11,7.11,0,0,1-2.4,1.51l-.09,0,.75,1.3a8.34,8.34,0,0,0,2.34-1.43c1.82-1.58,3-4,4.75-8.56l4.25-10.58Z" />
              <path d="M202.06,66.34a20.59,20.59,0,0,1-.2-3.3V57.57c0-3.67-1.71-5.61-5-5.61a7.85,7.85,0,0,0-4.17,1.21h0l.66,1.16a6,6,0,0,1,3.37-1h0a3.26,3.26,0,0,1,2.4.84,4.22,4.22,0,0,1,1,3.14v.26c-3.42,0-5.85.67-7.24,2a4.31,4.31,0,0,0-1.28,3.19,3.92,3.92,0,0,0,4.22,4,5.51,5.51,0,0,0,4.45-2.19l.19,1.87h1.52Zm-1.84-4.46a2.11,2.11,0,0,1-.14.8,4,4,0,0,1-4,2.72,2.57,2.57,0,0,1-2.68-2.79,2.91,2.91,0,0,1,.87-2.17c1-1,2.82-1.45,5.43-1.45h.53Z" />
              <path d="M239.57,66.34a20.59,20.59,0,0,1-.2-3.3V57.57c0-3.67-1.71-5.61-5-5.61a7.86,7.86,0,0,0-4,1.11l.66,1.15a6.12,6.12,0,0,1,3.2-.86h.05a3.26,3.26,0,0,1,2.4.84,4.22,4.22,0,0,1,1,3.14v.26c-3.41,0-5.85.67-7.24,2a4.31,4.31,0,0,0-1.28,3.19,3.92,3.92,0,0,0,4.22,4,5.51,5.51,0,0,0,4.45-2.19l.18,1.87h1.53Zm-1.84-4.46a2.11,2.11,0,0,1-.14.8,4,4,0,0,1-4,2.72,2.57,2.57,0,0,1-2.68-2.79,2.88,2.88,0,0,1,.87-2.17c1-1,2.82-1.45,5.43-1.45h.53" />
              <path
                fill="#3bb54a"
                d="M76.53,63.51a1.46,1.46,0,0,1-.63.15,1.42,1.42,0,0,1-1.23-.72l-.09-.2-3.83-8.41a.82.82,0,0,1-.07-.3.7.7,0,0,1,.7-.7.71.71,0,0,1,.43.14l4.52,3.22a2,2,0,0,0,1.15.34,2.18,2.18,0,0,0,.72-.13l21.27-9.47A22.52,22.52,0,0,0,82.27,40c-11.63,0-21.06,7.86-21.06,17.55,0,5.29,2.84,10,7.28,13.26A1.42,1.42,0,0,1,69.08,72a1.62,1.62,0,0,1-.07.44c-.36,1.33-.93,3.44-1,3.54a1.87,1.87,0,0,0-.12.52.71.71,0,0,0,.71.7.82.82,0,0,0,.4-.13l4.61-2.66A2.24,2.24,0,0,1,74.78,74a2.12,2.12,0,0,1,.62.1,25.22,25.22,0,0,0,6.87,1c11.63,0,21.06-7.86,21.06-17.55a15.16,15.16,0,0,0-2.4-8.13l-24.24,14Z"
              />
            </svg>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12 }}>
            {status === 'pending' && <p>Pending</p>}
            {status === 'cancel' && (
              <p>
                Cancelled
                <br />
                redirecting...
              </p>
            )}
            {status === 'paid' && (
              <p>
                Payment successful
                <br />
                redirecting...
              </p>
            )}
            {status === 'failed' && (
              <p>
                Payment failed
                <br />
                redirecting...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default WechatInApp;
