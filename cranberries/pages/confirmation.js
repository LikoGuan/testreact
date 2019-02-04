import React from 'react';
import Page from '../components/Page';
import numeral from 'numeral';
import { CURRENCIES_CODE_SIGN } from '../constants';

export default class Confirmation extends React.Component {
  render() {
    const {
      amount,
      currency,
      status,
      payment_method,
      merchant_reference
    } = this.props.url.query;

    return (
      <Page>
        <h2 style={{ textAlign: 'center' }}>
          支付{status === 'paid' ? '成功' : '失败'}
        </h2>
        <div
          className="lat-table"
          style={{ margin: '0 auto', maxWidth: '400px' }}
        >
          <div className="table-responsive">
            <table className="table  table-hover ">
              <tbody>
                <tr>
                  <td>金额</td>
                  <td>
                    {CURRENCIES_CODE_SIGN[currency] || '$'}
                    {numeral(amount).format('0,0.00')}
                    {' ' + currency}
                  </td>
                </tr>
                <tr>
                  <td> 支付方式</td>
                  <td>{payment_method}</td>
                </tr>
                <tr>
                  <td>订单ID</td>
                  <td>{merchant_reference}</td>
                </tr>
              </tbody>
            </table>
            <style jsx>{`
              td:first-of-type {
                width: 30%;
              }
            `}</style>
          </div>
        </div>
      </Page>
    );
  }
}
