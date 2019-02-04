import React from 'react';
import numeral from 'numeral';
import Page from '../components/Page';
// import * as api from '../client/api';
import { CURRENCIES_CODE_SIGN } from '../constants';

const LatipayLogo = () => (
  <div>
    <img
      className="wechat-payment-logo"
      src="/static/logo.svg"
      alt="latipay "
    />
    <style jsx>{`
      img {
        margin-bottom: 2rem;
        width: 130px;
      }
    `}</style>
  </div>
);

class Shopify extends React.Component {
  constructor() {
    super();
    this.state = {
      isPaying: false
    };
  }
  setPaymentMethod = paymentMethod => {
    this.setState({
      paymentMethod
    });
  };
  submit = async () => {
    window.location.href = '/flo2cash';
    return;

    // this.setState({
    //   isPaying: true
    // });

    // const order = this.props.url.query;

    // order.payment_method = this.state.paymentMethod;
    // const { data } = await api.payShopify(order);

    // if (data.code === 0) {
    //   window.location.href = data.url;
    // } else {
    //   window.alert(data.message);
    // }

    // this.setState({
    //   isPaying: false
    // });
  };
  //TODO check has paid successfully, to render differently
  render() {
    const { isPaying } = this.state;
    const {
      merchant_reference,
      amount,
      currency,
      product_name,
      user_id,
      paymentMethods
    } = this.props.url.query;

    return (
      <Page>
        <div className="row">
          <div className="col-sm-6 col-sm-8  col-sm-offset-3 col-md-offset-2">
            <LatipayLogo />
            <h2>
              {CURRENCIES_CODE_SIGN[currency]}
              {numeral(amount).format('0,0.00')}
              <small>{currency}</small>
            </h2>

            <div className="page-header lat-page-header">
              <h5>请选择支付方式</h5>
            </div>
            <div className="lat-invoice-pay-methods">
              {paymentMethods.map(pm => (
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
                  <img src={`/static/pay-${pm}.png`} alt={pm} />
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
                onClick={this.submit}
                disabled={isPaying}
              >
                &nbsp; &nbsp; &nbsp;PAY &nbsp; &nbsp; &nbsp;
              </button>
            )}
            <div className="page-header lat-page-header">
              <h5>订单信息</h5>
            </div>

            <div className="lat-table">
              <div className="table-responsive">
                <table className="table  table-hover ">
                  <tbody>
                    <tr>
                      <td>产品信息</td>
                      <td>{product_name}</td>
                    </tr>
                    <tr>
                      <td>订单编号</td>
                      <td>{merchant_reference}</td>
                    </tr>
                    <tr>
                      <td>订单创建人</td>
                      <td>{user_id}</td>
                    </tr>
                  </tbody>
                </table>
                <style jsx>{`
                  td:first-of-type {
                    width: 30%;
                  }
                  .attachment {
                    text-decoration: underline;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
export default Shopify;
