import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';

import { actions } from '../../redux/ducks/userDefaults';

import * as formValidations from '../../forms/formValidations';
import { renderInput, RenderSimplifySelect } from '../../forms/Fields';

import wechatLogo from '../../assets/btn-wechat.svg';
import aliLogo from '../../assets/btn-alipay.svg';

import { CURRENCIES_CODE_SIGN } from '../../constants';

const validators = formValidations.createValidator({
  wallet_id: [formValidations.required],
  amount: [formValidations.required]
});

const _Logo = props => <img {...props} alt={props.alt} />;
const Logo = styled(_Logo)`
  vertical-align: middle;
  padding-left: 10px;
  height: 50%;
`;

class HomeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wechat: true,
      alipay: true
    };
  }
  componentWillReceiveProps(nextProps) {
    const { initialValues: { wallet_id }, change } = nextProps;

    if (wallet_id) {
      const value = this.checkGateway(wallet_id, nextProps);
      this.setState({
        wechat: value.wechat,
        alipay: value.alipay
      });

      change('wallet_id', wallet_id);
    }
  }

  walletChanged = e => {
    const value = e.target.value;
    const state = this.checkGateway(e.target.value, this.props);

    this.setState({
      wechat: state.wechat,
      alipay: state.alipay
    });

    this.props.updateDefaultAccountCode({ accountCode: value });
  };

  checkGateway = (walletId, props) => {
    const { walletMaps } = props;
    const wallet = walletMaps[walletId];
    return {
      wechat: wallet.wechat,
      alipay: wallet.alipay
    };
  };

  render() {
    const {
      handleSubmit,
      wallets,
      walletMaps = {},
      defaultAccountCode,
      change,
      submitting
    } = this.props;

    const wallet = walletMaps[defaultAccountCode] || {};
    const currency = wallet ? wallet.currencyString : '';

    const options = wallets.map(item => {
      return { text: item.accountName, value: item.accountCode };
    });

    const { wechat, alipay } = this.state;

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
            id="amount"
            name="amount"
            type="number"
            component={renderInput}
            placeholder="Amount"
            prefix={CURRENCIES_CODE_SIGN[currency] || '$'}
            className="main-field-amount"
            prefixClassName="prefix"
          />
          <div className="main-currency">{currency}</div>
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

        <button
          className="main-method-btn main-method-btn--alipay"
          disabled={submitting || !alipay}
          type="submit"
          onClick={() => {
            document.getElementById('amount').blur();
            document.getElementById('merchant_reference').blur();
            change('payment_method', 'alipay');
          }}
        >
          <Logo src={aliLogo} alt="Alipay" title="Alipay" />
        </button>

        <button
          className="main-method-btn main-method-btn--wechat"
          disabled={submitting || !wechat}
          type="submit"
          onClick={() => {
            document.getElementById('amount').blur();
            document.getElementById('merchant_reference').blur();
            change('payment_method', 'wechat');
          }}
        >
          <Logo src={wechatLogo} alt="Wechat Pay" title="Wechat Pay" />
        </button>
      </form>
    );
  }
}

export default connect(state => {
  const {
    userDefaults: { accountCode: defaultAccountCode },
    data: { wallets, walletMaps }
  } = state;

  const obj = {
    wallets,
    walletMaps,
    defaultAccountCode,
    initialValues: {
      wallet_id: defaultAccountCode
    }
  };

  return obj;
}, actions)(
  reduxForm({
    form: 'spotpayForm',
    validate: validators,
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true
  })(HomeForm)
);
