import React from 'react';
import QRCode from 'qrcode.react';
import numeral from 'numeral';
import URL from 'url-parse';

import Page from '../components/Page';
import * as api from '../client/api';
import { CURRENCIES_CODE_SIGN } from '../constants';
import { staticConfirmation } from '../config';

// better user experience
const polling_interval = 1000;

const WechatLogo = () => (
  <div>
    <img
      className="wechat-payment-logo"
      src="/static/pay-wechat.png"
      alt="wechat payment"
    />
    <style jsx>{`
      img {
        margin-bottom: 2rem;
        width: 130px;
      }
    `}</style>
  </div>
);

class Wechat extends React.Component {
  async queryOrder() {
    const { transaction } = this.props.url.query;
    const { orderId } = transaction.paydata;
    const data = await api.queryOrder(orderId);

    //{"code":0,"message":"SUCCESS","orderId":"20171116-wechat-4120848871761",
    //"nonce":"3b9e2f201711160500534932834b593046d2b02647211a2d9a","type":"StaticPay",
    //"createDate":"2017-11-16 09:00:57","paymentMethod":"wechat","amount":"0.01","productType":null,"currency":"NZD",
    //"payerId":null,"organisationId":6,"userId":"U000000013","status":"paid","gateway":2,
    //"merchantReference":"","ip":"127.0.0.1","productName":"W000000068","returnUrl":"https://spotpay.latipay.net/static_qr_confirmation",
    //"callbackUrl":"https://spotpay.latipay.net/static_qr_confirmation",
    //"presentQr":"0","signature":"2ba6abea4c1d0ebd3811e70b8717c6623a5dc2d61458aae2a4d9e8c3e7b716a2"}
    const {
      status,
      returnUrl,
      currency,
      amount,
      paymentMethod,
      signature,
      merchantReference,
      createDate,
      payAmount,
      accountCode
    } = data;

    if (status === 'pending') {
      setTimeout(this.queryOrder.bind(this), polling_interval);
    } else {
      const finalUrl = returnUrl || staticConfirmation;
      var url = URL(finalUrl, true);

      const query = {
        ...url.query,
        merchant_reference: merchantReference,
        order_id: orderId,
        currency,
        status,
        payment_method: paymentMethod,
        signature,
        createDate
      };

      if (finalUrl.indexOf('.latipay.net/static_qr_confirmation') === -1) {
        query.amount = amount;
      } else {
        query.amount = payAmount ? payAmount : amount; //优先使用payAmount
        query.noads =
          accountCode === 'W000000247' || accountCode === 'W000000232';
      }

      url.set('query', query);

      api.log({ message: 'wechat qrcode paid success', href: url.href });

      location.href = url.href;
    }
  }
  componentDidMount() {
    this.queryOrder();
  }

  showAlert = name => () => {
    window.alert(
      `根据新西兰Fair Trading Act规定和保护，商家服务费系商家自主行为，与Latipay和${name}无关。`
    );
  };

  render() {
    const { transaction, qr } = this.props.url.query;
    const {
      amount,
      amountCNY,
      currency,
      productName,
      customerOrderId,
      isPayerPayFee,
      marginRate,
      currentRate,
      walletName,
      shifoushicnm,
      backPageUrl
    } = transaction.paydata;

    const feeIcon = (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        height="14"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
      >
        <g>
          <g>
            <g fill="#aaa">
              <circle cx="256" cy="378.5" r="25" />
              <path
                d="M256,0C114.516,0,0,114.497,0,256c0,141.484,114.497,256,256,256c141.484,0,256-114.497,256-256
            C512,114.516,397.503,0,256,0z M256,472c-119.377,0-216-96.607-216-216c0-119.377,96.607-216,216-216
            c119.377,0,216,96.607,216,216C472,375.377,375.393,472,256,472z"
              />
              <path
                d="M256,128.5c-44.112,0-80,35.888-80,80c0,11.046,8.954,20,20,20s20-8.954,20-20c0-22.056,17.944-40,40-40
            c22.056,0,40,17.944,40,40c0,22.056-17.944,40-40,40c-11.046,0-20,8.954-20,20v50c0,11.046,8.954,20,20,20
            c11.046,0,20-8.954,20-20v-32.531c34.466-8.903,60-40.26,60-77.469C336,164.388,300.112,128.5,256,128.5z"
              />
            </g>
          </g>
        </g>
      </svg>
    );

    return (
      <Page>
        <div className="row">
          <div className="col-sm-6 col-sm-8  col-sm-offset-3 col-md-offset-2">
            <WechatLogo />
            <h5>{walletName}</h5>
            {!shifoushicnm && (
              <h2 className="amount">
                {CURRENCIES_CODE_SIGN[currency]}{' '}
                {numeral(amount)
                  .divide(100)
                  .format('0,0.00')}
                <small>{currency}</small>
              </h2>
            )}
            {shifoushicnm && (
              <h2>
                ¥{' '}
                {numeral(amountCNY)
                  .divide(100)
                  .format('0,0.00')}
                <small>CNY</small>
              </h2>
            )}

            {isPayerPayFee &&
              marginRate &&
              marginRate > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 20,
                  lineHeight: 1,
                  fontSize: 12
                }}
              >
                <span>
                  {`商户服务费 ${numeral(marginRate).format('0.00')}%`}
                </span>
                <span
                  style={{
                    height: 14,
                    marginLeft: 5
                  }}
                  onClick={this.showAlert('微信')}
                >
                  {feeIcon}
                </span>
              </div>
            )}

            <div>
              <div>
                <QRCode size={150} value={qr} bgColor="transparent" />

                <style jsx>{`
                  div {
                    background-color: white;
                    display: inline-block;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                  }
                `}</style>
              </div>
              <p>
                请使用手机微信 扫描 二维码，截图或发送本链接到微信<span
                  style={{ color: '#ce6932' }}
                >
                  均无效
                </span>
              </p>
            </div>

            <div className="page-header lat-page-header">
              <h5>订单信息</h5>
            </div>

            <div className="lat-table">
              <div className="table-responsive">
                <table className="table  table-hover ">
                  <thead>
                    <tr />
                  </thead>
                  <tbody>
                    <tr>
                      <td>产品信息</td>
                      <td>{productName}</td>
                    </tr>
                    <tr>
                      <td>订单编号</td>
                      <td>{customerOrderId}</td>
                    </tr>
                    {currency !== 'CNY' && (
                      <tr>
                        <td>实时汇率</td>
                        <td>{currentRate}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <style jsx>{`
                  td:first-of-type {
                    width: 30%;
                  }
                `}</style>
              </div>

              {backPageUrl && (
                <a
                  href={backPageUrl}
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  {'<取消订单并返回'}
                </a>
              )}
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
export default Wechat;
