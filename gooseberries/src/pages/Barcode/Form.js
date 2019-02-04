import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import numeral from 'numeral';

import { actions } from '../../redux/ducks/userDefaults';

import * as formValidations from '../../forms/formValidations';
import { renderInput, RenderSimplifySelect } from '../../forms/Fields';

import wechatLogo from '../../assets/wechat-svg.svg';
import aliLogo from '../../assets/alipay-svg.svg';

import { CURRENCIES_CODE_SIGN } from '../../constants';

const validators = formValidations.createValidator({
  wallet_id: [formValidations.required],
  amount: [formValidations.required]
});

class Form extends React.Component {
  walletChanged = e => {
    this.props.updateDefaultAccountCode({
      accountCode: e.target.value
    });
  };

  componentWillReceiveProps(nextProps) {
    const { initialValues: { wallet_id }, change } = nextProps;
    if (wallet_id) {
      change('wallet_id', wallet_id);
    }
  }

  render() {
    const {
      handleSubmit,
      wallets,
      walletMaps = {},
      defaultAccountCode,
      rateAndChargeMap,
      amount
    } = this.props;

    const wallet = walletMaps[defaultAccountCode];
    const currencyString = wallet ? wallet.currencyString : '';

    const options = wallets.map(item => {
      return { text: item.accountName, value: item.accountCode };
    });

    let wechatTotal, alipayTotal;
    let { rate: wechatRate, margin: wechatMargin } =
      rateAndChargeMap.wechat || {};
    let { rate: alipayRate, margin: alipayMargin } =
      rateAndChargeMap.alipay || {};

    const isCNY = (wallet || {}).currencyString === 'CNY';
    if (isCNY) {
      wechatRate = 1;
      alipayRate = 1;
    }

    if (amount) {
      if (wechatMargin !== undefined && wechatRate) {
        const rate =
          wechatMargin > 0
            ? numeral(wechatMargin)
                .divide(100)
                .add(1)
                .value()
            : 1;

        wechatTotal = numeral(amount)
          .multiply(rate)
          .multiply(wechatRate);

        //round down
        const value = numeral(wechatTotal)
          .multiply(100) //乘100再floor再除100
          .value();
        wechatTotal = numeral(Math.floor(value))
          .divide(100)
          .format('0,0.00');
      }

      if (alipayMargin !== undefined && alipayRate) {
        alipayTotal = numeral(amount)
          .multiply(
            alipayMargin > 0
              ? numeral(alipayMargin)
                  .divide(100)
                  .add(1)
                  .value()
              : 1
          )
          .multiply(alipayRate)
          .format('0,0.00');
      }
    }

    const { alipay, wechat } = wallet || {};

    return (
      <form onSubmit={handleSubmit}>
        <Field
          id="wallet_id"
          name="wallet_id"
          component={RenderSimplifySelect}
          selectedAccountCode={defaultAccountCode}
          options={options}
          onChange={this.walletChanged}
        />

        <div style={{ position: 'relative' }}>
          <Field
            id="barcode_amount"
            name="amount"
            type="number"
            component={renderInput}
            placeholder="Amount"
            prefix={CURRENCIES_CODE_SIGN[currencyString] || '$'}
            className="main-field-amount"
            prefixClassName="prefix"
          />
          <div className="main-currency">{currencyString}</div>
        </div>
        <Field
          id="merchant_reference"
          name="merchant_reference"
          type="text"
          component={renderInput}
          label=""
          placeholder="Reference(optional)"
          className="main-field-reference"
        />
        <button className="barcode-btn" type="submit">
          Scan Barcode
        </button>
        {alipay &&
          wechat && (
            <p className="tips">
              Use Barcode Scanner to scan Payment Barcode <br />in{' '}
              <span className="green">Alipay </span>
              app or <span className="green">Wechat </span>
              app
            </p>
          )}

        {alipay &&
          !wechat && (
            <p className="tips">
              Use Barcode Scanner to scan Payment Barcode <br />in{' '}
              <span className="green">Alipay </span>app
            </p>
          )}

        {!alipay &&
          wechat && (
            <p className="tips">
              Use Barcode Scanner to scan Payment Barcode <br />in{' '}
              <span className="green">Wechat </span>app
            </p>
          )}

        <table className="barcode1">
          <tbody>
            <tr>
              {alipay && (
                <td>
                  <img className="qr-modal__payment" src={aliLogo} alt="" />
                  {!isCNY && (
                    <p>
                      Fx rate 1 {currencyString} ≈{' '}
                      <strong>{alipayRate} CNY</strong>
                    </p>
                  )}

                  {alipayTotal && <p className="total">≈ {alipayTotal} CNY</p>}
                </td>
              )}

              {wechat && (
                <td>
                  <img className="qr-modal__payment" src={wechatLogo} alt="" />
                  {!isCNY && (
                    <p>
                      Fx rate 1 {currencyString} ≈{' '}
                      <strong>{wechatRate} CNY</strong>
                    </p>
                  )}
                  {wechatTotal && <p className="total">≈ {wechatTotal} CNY</p>}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}

const selector = formValueSelector('barcodeForm');

export default connect(state => {
  const {
    data: { profile, wallets, walletMaps, rateAndCharge },
    userDefaults: { accountCode: defaultAccountCode }
  } = state;

  const props = {
    wallets,
    walletMaps,
    defaultAccountCode,
    amount: selector(state, 'amount'),
    initialValues: {
      wallet_id: defaultAccountCode
    },
    rateAndChargeMap:
      rateAndCharge[profile.user_id + '' + defaultAccountCode] || {}
  };

  return props;
}, actions)(
  reduxForm({
    form: 'barcodeForm',
    validate: validators,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
  })(Form)
);
