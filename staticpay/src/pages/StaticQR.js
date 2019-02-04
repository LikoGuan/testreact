import React, { Component } from 'react';
import styled from 'styled-components';
import numeral from 'numeral';
import { IntlProvider, FormattedMessage } from 'react-intl';

import StaticForm from './StaticQRForm';
import api from '../api';
import { genPayData2, isWexin } from '../utils';

import Footer from '../components/SupportbyFooter';

import { locale, messages, localizedText } from '../i18n';

const WalletName = styled.div`
  color: #47474;
  text-align: center;
  padding: 1em 0;
  font-size: 1.7em;
  min-height: 90px;
`;

const walletIdReferenceRequired = 'W000000174';

class StaticQR extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPaying: false,
      error: false,
      data: {
        accountName: localizedText('staticqr.loading')
      },
      isPayAlipay: false
    };

    const { search } = props.location || {};
    const params = new URLSearchParams(search);
    const payCurrency = params.get('pay_currency');
    if (payCurrency) {
      this.state.currencyInQuery = payCurrency;
    }

    this.loading = false;
    this.onSubmit = this.onSubmit.bind(this);
  }
  async componentDidMount() {
    const { wallet_id, user_id } = this.props.match.params;
    const { data } = await api.staticQR.get(
      isWexin ? 'wechat' : 'alipay',
      user_id,
      wallet_id
    );

    if (data.data) {
      this.setState({
        data: data.data
      });
    } else if (data.code) {
      this.setState({
        error: true
      });
    }
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  async onSubmit(form) {
    const value = numeral(form.amount).value();
    if (!this.isNumeric(value)) {
      alert(localizedText('staticqr.number'));
      return;
    }

    if (value <= 0) {
      alert(localizedText('staticqr.minimum'));
      return;
    }

    if (form.reference && form.reference.length > 50) {
      alert(localizedText('staticqr.reftoolong'));
      return;
    }

    const { wallet_id, user_id } = this.props.match.params;

    if (
      wallet_id === walletIdReferenceRequired &&
      (!form.reference || form.reference === '')
    ) {
      alert(localizedText('staticqr.need_reference'));
      return;
    }

    //TODO remove this.loading
    if (this.loading) return;
    this.loading = true;
    this.setState({ isPaying: true });

    const payment_method = isWexin ? 'wechat' : 'alipay';
    const payData = genPayData2(form, {
      user_id,
      wallet_id,
      payment_method,
      currency: this.currency()
    });

    if (payment_method === 'wechat') {
      const openId = window.localStorage.getItem('openId');
      if (openId) payData.openId = openId;

      //post (请求1)
      //后端重定向浏览器向微信获取code；微信重定向浏览器传给后台code（请求2）；后台向微信读取openId
      //后端重定向把请求2重定向回前端的url (/static_qr/wechat_in_app)，并附上所需gateway参数
    }

    api.transaction.init(payData, this.form);
  }

  currency = () => {
    //优先取url里的currency
    const { currencyInQuery } = this.state;
    const { currency, orgCurrency } = this.state.data;
    if (
      currencyInQuery &&
      (currencyInQuery === currency ||
        currencyInQuery === orgCurrency ||
        currencyInQuery === 'CNY')
    ) {
      return currencyInQuery;
    }

    return currency;
  };

  render() {
    const { isPayingAlipay, data } = this.state;
    const { rate, charge, accountName } = data;

    const currency = this.currency();

    const { error, isPaying } = this.state;
    let { preset_amount, wallet_id } = this.props.match.params;
    if (parseFloat(preset_amount) > 0) {
      const value = Math.floor(
        numeral(preset_amount)
          .multiply(100)
          .value()
      );
      preset_amount = numeral(value)
        .divide(100)
        .value();

      console.log('preset_amount', preset_amount);
    } else {
      preset_amount = undefined;
    }

    const referenceRequired = wallet_id === walletIdReferenceRequired;

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <React.Fragment>
          {!isPayingAlipay && (
            <div>
              <div className="staticqr-form">
                <WalletName style={error ? { color: 'red' } : {}}>
                  {error ? (
                    <FormattedMessage id="staticqr.invalide.account" />
                  ) : (
                    accountName
                  )}
                </WalletName>

                <StaticForm
                  onSubmit={this.onSubmit}
                  rate={rate}
                  charge={charge}
                  preset_amount={preset_amount}
                  currency={currency}
                  isPaying={isPaying}
                  referenceRequired={referenceRequired}
                />
              </div>
              <div ref={ref => (this.form = ref)} />
              <Footer />
            </div>
          )}
        </React.Fragment>
      </IntlProvider>
    );
  }
}

export default StaticQR;
