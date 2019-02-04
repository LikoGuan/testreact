import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import numeral from 'numeral';

import { Button } from 'primitive-collections';
import * as formValidations from '../forms/formValidations';
import { renderInput } from '../forms/Fields';
import { isWexin } from '../utils';

import wechatLogo from '../assets/btn-wechat.svg';
import aliLogo from '../assets/btn-alipay.svg';

import { localizedText } from '../i18n';
import { CURRENCIES_CODE_SIGN } from '../constants';

const _Logo = props => <img {...props} alt={props.alt} />;
const Logo = styled(_Logo)`
  vertical-align: middle;
  padding-left: 10px;
  height: 50%;
`;

const validators = formValidations.createValidator({
  amount: [formValidations.required]
});
const StaticQRButton = styled(Button)`
  background: ${isWexin ? '#09BB07' : '#149CE3'};
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CNY = styled.span`
  font-size: 0.9em;
  float: right;
  color: #757575;
`;

class StaticQRForm extends Component {
  componentDidMount() {
    const { preset_amount } = this.props;
    if (preset_amount) {
      this.props.change('amount', preset_amount);
    }
  }

  showAlert = name => () => {
    window.alert(
      `根据新西兰Fair Trading Act规定和保护，商家服务费系商家自主行为，与Latipay和${name}无关。`
    );
  };

  render() {
    const {
      handleSubmit,
      rate,
      charge,
      amount,
      currency,
      preset_amount,
      submitting,
      invalidWallet,
      isPaying,
      referenceRequired
    } = this.props;

    let fee = 0;
    let total = 0;

    const isCNY = currency === 'CNY';
    const rateValue = isCNY ? 1 : rate;

    if (amount && rate && (charge !== null && charge !== undefined)) {
      fee =
        charge > 0
          ? numeral(amount)
              .multiply(rateValue)
              .multiply(charge)
              .divide(100)
              .value()
          : 0;

      if (isWexin) {
        //微信round down，不四舍五入
        const value = numeral(amount)
          .multiply(rateValue)
          .add(fee)
          .multiply(100) //乘100再floor再除100
          .value();
        total = numeral(Math.floor(value))
          .divide(100)
          .format('0,0.00');
      } else {
        total = numeral(amount)
          .multiply(rateValue)
          .add(fee)
          .format('0,0.00');
      }
    }

    const feeIcon = (
      <span
        style={{
          height: 16,
          marginLeft: 7
        }}
        onClick={this.showAlert(isWexin ? '微信' : '支付宝')}
      >
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
              <g fill="#bbb">
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
      </span>
    );

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <Field
            id="amount"
            name="amount"
            type="number"
            component={renderInput}
            placeholder={localizedText('staticqr.amount.placeholder')}
            prefix={CURRENCIES_CODE_SIGN[currency]}
            label={localizedText('staticqr.amount')}
            disabled={preset_amount !== undefined}
            className={
              preset_amount
                ? 'staticqr-field-amount staticqr-field-amount__disabled'
                : 'staticqr-field-amount'
            }
            prefixClassName={preset_amount ? 'prefix__green' : 'prefix'}
          />
          <div
            className={preset_amount ? 'currency currency__green' : 'currency'}
          >
            {currency}
          </div>
        </div>

        <Row>
          <div className="staticqr-fee-container">
            <div className="staticqr-fee">
              {currency &&
                !isCNY && (
                  <span>
                    {localizedText('staticqr.rate')}{' '}
                    {currency &&
                      currency !== 'CNY' &&
                      `1 ${currency} ≈ ${rate} CNY`}
                  </span>
                )}

              {charge > 0 &&
                currency &&
                isCNY && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>
                      {localizedText(
                        isWexin ? 'staticqr.fee.wechat' : 'staticqr.fee'
                      )}{' '}
                      {numeral(charge).format('0.00')}%
                    </span>
                    {feeIcon}
                  </div>
                )}

              {amount &&
                (!isCNY || charge > 0) && (
                  <CNY>
                    {localizedText('staticqr.total', 'Total')}
                    {` ≈ ${total} CNY`}
                  </CNY>
                )}
            </div>

            <div className="staticqr-fee">
              {charge > 0 &&
                currency &&
                !isCNY && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>
                      {localizedText(
                        isWexin ? 'staticqr.fee.wechat' : 'staticqr.fee'
                      )}{' '}
                      {numeral(charge).format('0.00')}%
                    </span>
                    {feeIcon}
                  </div>
                )}
            </div>
          </div>
        </Row>
        <Field
          id="reference"
          name="reference"
          type="text"
          component={renderInput}
          label=""
          placeholder={
            referenceRequired
              ? localizedText('staticqr.reference.placeholder.required')
              : localizedText('staticqr.reference.placeholder')
          }
          className="staticqr-field-reference"
        />
        <StaticQRButton
          className="staticqr-btn"
          disabled={submitting || invalidWallet || isPaying}
          type="submit"
        >
          <Logo
            src={isWexin ? wechatLogo : aliLogo}
            alt={
              isWexin
                ? localizedText('staticqr.wechatpay')
                : localizedText('staticqr.alipay')
            }
          />
        </StaticQRButton>
      </form>
    );
  }
}

const selector = formValueSelector('staticqr');
export default connect(state => ({
  amount: selector(state, 'amount')
}))(
  reduxForm({
    form: 'staticqr',
    validate: validators
  })(StaticQRForm)
);
