import React from 'react';
import numeral from 'numeral';
import Page from '../components/Page';
import * as api from '../client/api';
import { isMobile, isiOS, isWechat, isAlipay } from '../server/util';
import { CURRENCIES_CODE_SIGN } from '../constants';
import clipboard from 'clipboard-polyfill';

const svg1 = `<svg width="33px" height="33px" viewBox="0 0 469 469" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <polygon id="path-1" points="0 0.387 468.613 0.387 468.613 468.94 0 468.94"></polygon>
            </defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="worldwide">
                    <g id="Group-3">
                        <mask id="mask-2" fill="white">
                            <use xlink:href="#path-1"></use>
                        </mask>
                        <g id="Clip-2"></g>
                        <path d="M234.306,26.912 C119.735,26.912 26.525,120.122 26.525,234.694 C26.525,349.265 119.735,442.475 234.306,442.475 C348.879,442.475 442.089,349.265 442.089,234.694 C442.089,120.122 348.879,26.912 234.306,26.912 Z M234.306,469 C105.111,469 0,363.894 0,234.694 C0,105.498 105.111,0.387 234.306,0.387 C363.507,0.387 468.614,105.498 468.614,234.694 C468.614,363.894 363.507,469 234.306,469 Z" id="Fill-1" fill="#5F605C" mask="url(#mask-2)"></path>
                    </g>
                    <path d="M92.41,77.629 C131.557,113.257 181.862,132.77 235.072,132.77 C288.286,132.766 338.595,113.252 377.738,77.629 C338.595,42.005 288.286,22.492 235.072,22.492 C181.858,22.492 131.552,42.005 92.41,77.629 Z M235.072,150.454 C174.125,150.454 116.693,126.824 73.351,83.915 C71.676,82.257 70.73,79.994 70.73,77.633 C70.73,75.272 71.671,73.013 73.351,71.351 C116.685,28.437 174.116,4.808 235.072,4.808 C296.027,4.808 353.463,28.437 396.797,71.347 C398.471,73.009 399.418,75.272 399.418,77.629 C399.418,79.985 398.471,82.248 396.797,83.91 C353.463,126.82 296.027,150.45 235.072,150.454 Z" id="Fill-4" fill="#5F605C"></path>
                    <path d="M96.601,395.411 C135.142,428.682 183.948,446.896 235.076,446.896 C286.204,446.896 335.01,428.682 373.555,395.411 C335.006,362.148 286.199,343.929 235.072,343.929 C183.944,343.929 135.142,362.139 96.601,395.411 Z M235.076,464.579 C176.216,464.579 120.195,442.298 77.339,401.838 C75.57,400.167 74.567,397.846 74.567,395.411 C74.567,392.975 75.57,390.654 77.339,388.983 C120.195,348.527 176.212,326.25 235.072,326.25 C293.935,326.25 349.957,348.527 392.822,388.983 C394.59,390.654 395.593,392.975 395.593,395.411 C395.593,397.846 394.59,400.167 392.822,401.838 C349.962,442.298 293.94,464.579 235.076,464.579 Z" id="Fill-5" fill="#5F605C"></path>
                    <polygon id="Fill-6" fill="#5F605C" points="4.533 243.545 464.533 243.545 464.533 225.545 4.533 225.545"></polygon>
                    <path d="M234.32,22.492 C199.824,22.492 161.389,109.64 161.389,234.694 C161.389,359.747 199.824,446.896 234.32,446.896 C268.816,446.896 307.252,359.747 307.252,234.694 C307.252,109.64 268.816,22.492 234.32,22.492 Z M234.32,464.579 C183.506,464.579 143.705,363.602 143.705,234.694 C143.705,105.785 183.506,4.808 234.32,4.808 C285.133,4.808 324.935,105.785 324.935,234.694 C324.935,363.602 285.133,464.579 234.32,464.579 Z" id="Fill-7" fill="#5F605C"></path>
                    <path d="M305.805,102.483 C320.86,102.483 333.065,114.687 333.065,129.742 C333.065,144.797 320.86,157.001 305.805,157.001 C290.751,157.001 278.547,144.797 278.547,129.742 C278.547,114.687 290.751,102.483 305.805,102.483" id="Fill-8" fill="#FFFFFE"></path>
                    <path d="M305.81,111.342 C295.655,111.342 287.392,119.605 287.392,129.76 C287.392,139.914 295.655,148.177 305.81,148.177 C315.965,148.177 324.227,139.914 324.227,129.76 C324.227,119.605 315.965,111.342 305.81,111.342 Z M305.81,165.861 C285.903,165.861 269.71,149.667 269.71,129.76 C269.71,109.852 285.903,93.659 305.81,93.659 C325.717,93.659 341.911,109.852 341.911,129.76 C341.911,149.667 325.717,165.861 305.81,165.861 Z" id="Fill-9" fill="#91928E"></path>
                    <path d="M304.855,319.412 C319.913,319.412 332.119,331.618 332.119,346.674 C332.119,361.732 319.913,373.938 304.855,373.938 C289.798,373.938 277.591,361.732 277.591,346.674 C277.591,331.618 289.798,319.412 304.855,319.412" id="Fill-10" fill="#FFFFFE"></path>
                    <path d="M304.855,328.248 C294.696,328.248 286.433,336.511 286.433,346.67 C286.433,356.829 294.696,365.092 304.855,365.092 C315.014,365.092 323.277,356.829 323.277,346.67 C323.277,336.511 315.014,328.248 304.855,328.248 Z M304.855,382.776 C284.948,382.776 268.75,366.578 268.75,346.67 C268.75,326.763 284.948,310.565 304.855,310.565 C324.762,310.565 340.961,326.763 340.961,346.67 C340.961,366.578 324.762,382.776 304.855,382.776 Z" id="Fill-11" fill="#91928E"></path>
                    <path d="M152.534,207.434 C167.589,207.434 179.793,219.639 179.793,234.694 C179.793,249.748 167.589,261.953 152.534,261.953 C137.479,261.953 125.275,249.748 125.275,234.694 C125.275,219.639 137.479,207.434 152.534,207.434" id="Fill-12" fill="#FFFFFE"></path>
                    <path d="M152.551,216.276 C142.397,216.276 134.134,224.539 134.134,234.694 C134.134,244.848 142.397,253.111 152.551,253.111 C162.706,253.111 170.969,244.848 170.969,234.694 C170.969,224.539 162.706,216.276 152.551,216.276 Z M152.551,270.794 C132.644,270.794 116.45,254.601 116.45,234.694 C116.45,214.787 132.644,198.593 152.551,198.593 C172.459,198.593 188.652,214.787 188.652,234.694 C188.652,254.601 172.459,270.794 152.551,270.794 Z" id="Fill-13" fill="#91928E"></path>
                </g>
            </g>
        </svg>`;

const LatipayLogo = () => (
  <div>
    <img className="wechat-payment-logo" src="/static/logo.svg" alt="latipay" />
    <style jsx>{`
      .invoice-logo {
        margin-bottom: 2rem;
        width: 130px;
      }
    `}</style>
  </div>
);

const WechatButton = ({ isPaying, submit }) => (
  <div>
    <button
      className="staticqr-btn"
      disabled={isPaying}
      onClick={submit('wechat')}
    >
      <img
        className="payment-logo"
        src="/static/btn-wechat.svg"
        alt="wechatpay "
      />
    </button>
    <style jsx>{`
      .staticqr-btn {
        border: none;
        border-radius: 4px;
        display: block;
        width: 90%;
        margin: 0 auto;
        text-align: center;
        height: 50px;
        background-color: #09bb07;
        margin-bottom: 30px;
      }
      .payment-logo {
        vertical-align: middle;
        height: 50%;
      }
    `}</style>
  </div>
);

const AlipayButton = ({ isPaying, submit }) => (
  <div>
    <button
      className="staticqr-btn"
      disabled={isPaying}
      onClick={submit('alipay')}
    >
      <img
        className="payment-logo"
        src="/static/btn-alipay.svg"
        alt="alipay "
      />
    </button>
    <style jsx>{`
      .staticqr-btn {
        border: none;
        border-radius: 4px;
        display: block;
        width: 90%;
        margin: 0 auto;
        text-align: center;
        height: 50px;
        background-color: #149ce3;
        margin-bottom: 30px;
      }
      .payment-logo {
        vertical-align: middle;
        height: 50%;
      }
    `}</style>
  </div>
);

const paymentMethods = ['wechat', 'alipay', 'flo2cash', 'polipay'];

class Invoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPaying: false,
      isMobile: null,
      wechat: null,
      alipay: null,
      openInSafari: false
    };
  }

  componentDidMount() {
    const wechat = isWechat();
    this.setState({
      isMobile: isMobile() || isiOS(),
      wechat,
      alipay: !wechat && isAlipay()
    });
  }

  setPaymentMethod = paymentMethod => {
    this.setState({
      paymentMethod
    });
  };

  submit = method => async () => {
    const { invoice } = this.props.url.query;
    const { isMobile, wechat } = this.state;
    if (isMobile) {
      if (method === 'wechat' && !wechat) {
        clipboard.writeText(location.href);
        alert(
          '使用微信支付，请在微信内打开此链接（链接已经复制) Link copied, please open this link in Wechat.'
        );
        return;
      }

      if (method === 'alipay' && wechat) {
        this.setState({
          openInSafari: true
        });
        // clipboard.writeText(location.href);

        // alert('Link copied, please open this link in Safari or Alipay.');
        return;
      }
    }

    this.setState({
      isPaying: true
    });

    const { invoice_id, token } = invoice;
    const paymentMethod = this.state.paymentMethod || method;
    const body = {
      invoice_id: invoice_id,
      payment_method: paymentMethod,
      token: token
    };

    const data = await api.payInvoiceNew(body);

    api.log({ message: 'invoice', body, data });

    if (data) {
      if (data.code === 0) {
        const { host_url, nonce } = data;

        // if (paymentMethod === 'wechat' && config.backend.base.indexOf('staging') !== -1) {
        //   window.location.href = 'https://pay-staging.latipay.net/pay/' + nonce;
        // }else {

        const url = host_url + '/' + nonce;
        window.location.href = url;
        // }
      } else {
        window.alert(data.message);
      }
    }

    this.setState({
      isPaying: false
    });
  };

  getMobileButtons = () => {
    const { isPaying, alipay, wechat } = this.state;

    const { invoice } = this.props.url.query;
    (invoice.payment_methods || []).forEach(item => {
      invoice[item.toLowerCase()] = true;
    });

    const alipayBigBtn = invoice.alipay && (!wechat || !invoice.wechat);
    const wechantBigBtn =
      !alipayBigBtn && invoice.wechat && (!alipay || !invoice.alipay);

    const wechatSmallBtn = !wechantBigBtn && invoice.wechat;
    const alipaySmallBtn = !alipayBigBtn && invoice.alipay;

    return (
      <div style={{ marginTop: '20px' }}>
        {wechantBigBtn && (
          <WechatButton isPaying={isPaying} submit={this.submit} />
        )}

        {alipayBigBtn && (
          <AlipayButton isPaying={isPaying} submit={this.submit} />
        )}

        {wechatSmallBtn && (
          <div
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#888',
              textDecoration: 'underline'
            }}
            onClick={this.submit('wechat')}
          >
            使用微信支付
          </div>
        )}

        {alipaySmallBtn && (
          <div
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#888',
              textDecoration: 'underline'
            }}
            onClick={this.submit('alipay')}
          >
            使用支付宝
          </div>
        )}

        {!wechantBigBtn &&
          !alipayBigBtn &&
          !wechatSmallBtn &&
          !alipaySmallBtn && (
          <div
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#888'
            }}
          >
              No payment gateway available!
          </div>
        )}
      </div>
    );
  };

  showAlert = name => () => {
    window.alert(
      `根据新西兰Fair Trading Act规定和保护，商家服务费系商家自主行为，与Latipay${
        name !== '' ? '和' : ''
      }${name}无关。`
    );
  };

  render() {
    const {
      isPaying,
      isMobile,
      paymentMethod,
      wechat,
      openInSafari
    } = this.state;
    const { invoice } = this.props.url.query;
    const {
      invoice_id,
      walletName,
      currency,
      amount,
      organisation,
      product_name,
      payee,
      payer,
      customer_order_id,
      customer_reference,
      attachments,
      payment_methods,
      margins = {}
    } = invoice;

    (payment_methods || []).forEach(item => {
      invoice[item.toLowerCase()] = true;
    });

    let margin = 0;
    let tips = '';
    if (isMobile) {
      if (invoice.wechat && (wechat || !invoice.alipay)) {
        margin = margins['wechat'];
        tips = '微信';
      } else {
        margin = margins['alipay'];
        tips = '支付宝';
      }
    } else {
      margin = paymentMethod ? margins[paymentMethod] : '';
      tips = paymentMethod === 'wechat' ? '微信' : '支付宝';
    }

    margin = margin > 0 ? margin : undefined;

    const feeIcon = (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        height="16"
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
          <div className="col-sm-6 col-md-8 col-sm-offset-3 col-md-offset-2">
            <LatipayLogo />
            <h5>{walletName}</h5>
            <h2 className="amount">
              {CURRENCIES_CODE_SIGN[currency]}{' '}
              {numeral(amount).format('0,0.00')}
              <small>{currency}</small>
            </h2>

            <p style={{ minHeight: 22, fontSize: 12 }}>
              {margin &&
                margin > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 20,
                    lineHeight: 1
                  }}
                >
                  <span>
                    {`商户服务费 ${numeral(margin)
                      .multiply(100)
                      .format('0.00')}%`}
                  </span>
                  <span
                    style={{
                      height: 16,
                      marginLeft: 5
                    }}
                    onClick={this.showAlert(tips)}
                  >
                    {feeIcon}
                  </span>
                </div>
              )}
            </p>

            {isMobile === false && (
              <div>
                <div className="page-header lat-page-header">
                  <h5>请选择支付方式</h5>
                </div>
                <div className="lat-invoice-pay-methods">
                  {paymentMethods.filter(pm => invoice[pm]).map(pm => (
                    <label
                      key={pm}
                      className="lat-invoce-pay-method"
                      htmlFor={`pay-${pm}`}
                    >
                      <input
                        id={`pay-${pm}`}
                        type="radio"
                        name="pay-method"
                        onClick={() => this.setPaymentMethod(pm)}
                      />
                      <img
                        src={`/static/pay-${pm.toLowerCase()}.png`}
                        alt={pm}
                      />
                    </label>
                  ))}

                  <style jsx>{`
                    .lat-invoice-pay-methods {
                      display: flex;
                      flex-wrap: wrap;
                    }
                    .lat-invoce-pay-method {
                      width: 25%;
                      min-width: 150px;
                    }
                    .lat-invoce-pay-method img {
                      width: 100px;
                      margin: 1em;
                    }
                  `}</style>
                </div>
                {this.state.paymentMethod && (
                  <button
                    className="btn btn-success"
                    type="submit"
                    onClick={this.submit()}
                    disabled={isPaying}
                  >
                    &nbsp; &nbsp; &nbsp;PAY &nbsp; &nbsp; &nbsp;
                  </button>
                )}
              </div>
            )}

            {isMobile && this.getMobileButtons()}

            <div className="page-header lat-page-header">
              <h5>订单信息</h5>
            </div>

            <div className="lat-table">
              <div className="table-responsive">
                <table className="table table-hover">
                  <tbody>
                    {organisation && (
                      <tr>
                        <td>注册公司</td>
                        <td>{organisation}</td>
                      </tr>
                    )}
                    {product_name && (
                      <tr>
                        <td>产品信息</td>
                        <td>{product_name}</td>
                      </tr>
                    )}
                    <tr>
                      <td>订单编号</td>
                      <td>{invoice_id}</td>
                    </tr>
                    {customer_order_id && (
                      <tr>
                        <td>商户订单编号</td>
                        <td>{customer_order_id}</td>
                      </tr>
                    )}
                    {payee && (
                      <tr>
                        <td>订单创建人</td>
                        <td>{payee}</td>
                      </tr>
                    )}
                    {payer && (
                      <tr>
                        <td>付款人</td>
                        <td>{payer}</td>
                      </tr>
                    )}
                    {customer_reference && (
                      <tr>
                        <td>备注</td>
                        <td>{customer_reference}</td>
                      </tr>
                    )}
                    {attachments && (
                      <tr>
                        <td>附件</td>
                        <td>
                          {attachments.map(att => (
                            <div key={att.url}>
                              <a className="attachment" href={att.url}>
                                {att.name}
                              </a>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <style jsx>{`
                  table {
                    table-layout: fixed;
                  }
                  td:first-of-type {
                    width: 30%;
                  }
                  td:nth-of-type(2) {
                    width: 70%;
                  }
                  .attachment {
                    text-decoration: underline;
                  }
                `}</style>
              </div>
            </div>
          </div>

          {openInSafari && (
            <div
              onClick={() => {
                this.setState({
                  openInSafari: false
                });
              }}
            >
              <div id="open-in-safari">
                <div
                  className="open-in-safari-pop"
                  id="open-in-safari-pop-android"
                >
                  <div dangerouslySetInnerHTML={{ __html: svg1 }} />
                  <p style={{ marginTop: '10px' }}>
                    请使用
                    {paymentMethod === 'wechat' ? '微信' : '浏览器'}
                    打开
                    <br />
                    Please open in{' '}
                    {paymentMethod === 'wechat' ? 'Wechat' : 'the Browser'}
                  </p>
                </div>
              </div>
              <style jsx>{`
                #open-in-safari {
                  z-index: 10;
                  width: 100%;
                  height: 100%;
                  position: fixed;
                  top: 0;
                  left: 0;
                  background: rgba(0, 0, 0, 0.4);
                }

                #open-in-safari p {
                  font-size: 14px;
                }

                .open-in-safari-pop {
                  background: #fff;
                  position: absolute;
                  right: 20px;
                  top: 30px;
                  width: 100px;
                  color: #222951;
                  text-align: center;
                  padding: 10px;
                }

                .open-in-safari-pop:after {
                  content: ' ';
                  display: block;
                  position: absolute;
                  top: -35px;
                  right: 0;
                  width: 20px;
                  height: 40px;
                  background: -webkit-linear-gradient(
                    -45deg,
                    #fff 40%,
                    transparent 40%
                  );
                  background: -o-linear-gradient(
                    -45deg,
                    #fff 40%,
                    transparent 40%
                  );
                  background: -moz-linear-gradient(
                    -45deg,
                    #fff 40%,
                    transparent 40%
                  );
                  background: linear-gradient(
                    -45deg,
                    #fff 40%,
                    transparent 40%
                  );
                }
              `}</style>
            </div>
          )}
        </div>
      </Page>
    );
  }
}
export default Invoice;
