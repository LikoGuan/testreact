import React from 'react';
import classNames from 'classnames';
import numeral from 'numeral';

import Page from '../components/Page';
import { BANKS, BANKS_ARRAY } from '../constants';
import { makeForm } from '../server/util';
import { CURRENCIES_CODE_SIGN } from '../constants';

const Logo = () => (
  <div>
    <img
      className="onlinebank-payment-logo"
      src="/static/pay-onlinebank.png"
      alt="onlinebank payment"
    />
    <style jsx>{`
      img {
        margin-bottom: 2rem;
        width: 130px;
      }
    `}</style>
  </div>
);

class OnlineBank extends React.Component {
  constructor(props) {
    super(props);
    const { transaction } = props.url.query;
    const { bankId, name, nationId } = transaction.paydata || {};
    this.state = {
      form: {
        v_pmode: bankId || '',
        v_idnumber: nationId || '',
        v_idname: name || ''
      },
      errors: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange = name => evt => {
    this.setState({
      form: {
        ...this.state.form,
        [name]: evt.target.value
      }
    });
  };
  async onSubmit(e) {
    e.preventDefault();
    const v_idnumberRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

    const v_idname = !this.state.form.v_idname;
    const v_idnumber = !v_idnumberRegex.test(this.state.form.v_idnumber);
    const v_pmode = !this.state.form.v_pmode;
    this.setState({
      errors: {
        v_idname,
        v_idnumber,
        v_pmode
      }
    });

    if (!v_idname && !v_idnumber && !v_pmode) {
      const { transaction } = this.props.url.query;

      const formData = {
        ...transaction.gatewaydata,
        ...this.state.form
      };

      makeForm(this.form, transaction.gateway_url, formData);
    }
  }

  render() {
    const { transaction } = this.props.url.query;
    const {
      bankId,
      name,
      nationId,
      orgName,
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
      returnUrl
    } =
      transaction.paydata || {};

    const isStudyPay =
      returnUrl.indexOf('studypay-dev.latipay.net/payment/return') !== -1 ||
      returnUrl.indexOf('studypay.latipay.net/payment/return') !== -1;

    const { errors } = this.state;
    return (
      <Page>
        <div className="row">
          <div className="col-sm-6 col-sm-8  col-sm-offset-3 col-md-offset-2">
            <Logo />
            <h5>{walletName}</h5>
            {!shifoushicnm && (
              <h2 style={{ fontWeight: 'bold' }}>
                {CURRENCIES_CODE_SIGN[currency]}{' '}
                {numeral(amount)
                  .divide(100)
                  .format('0,0.00')}
                <small>{currency}</small>
              </h2>
            )}
            {shifoushicnm && (
              <h2 className="amount">
                ¥{' '}
                {numeral(amountCNY)
                  .divide(100)
                  .format('0,0.00')}
                <small>CNY</small>
              </h2>
            )}
            {isPayerPayFee &&
              !isStudyPay && <sup>Latipay将收取{marginRate}%的服务费</sup>}
            {isPayerPayFee && isStudyPay && <sup>服务费：0.00</sup>}

            <form onSubmit={this.onSubmit}>
              <style jsx>
                {`
                  form {
                    margin-top: 2rem;
                  }
                  .bank {
                    height: 31px;
                    width: 33.33%;
                    float: left;
                    display: table;
                    margin-bottom: 10px;
                  }
                  .bank input,
                  .bank label {
                    display: table-cell;
                    text-align: left;
                    padding-left: 10px;
                  }
                  .bank label {
                    width: 100%;
                  }
                  .btn-lg {
                    display: block;
                    clear: left;
                  }
                  .help-block {
                    clear: left;
                  }
                `}
              </style>

              <div
                className={classNames('form-group', {
                  'has-warning': errors.v_idname
                })}
              >
                <label className="control-label" htmlFor="v_idname">
                  姓名
                </label>
                {name ? (
                  <input
                    type="text"
                    className="form-control"
                    id="v_idname"
                    disabled={true}
                    value={name}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="v_idname"
                    placeholder="姓名"
                    onChange={this.onChange('v_idname')}
                  />
                )}
                {errors.v_idname && (
                  <span className="help-block">请输入姓名</span>
                )}
              </div>
              <div
                className={classNames('form-group', {
                  'has-warning': errors.v_idnumber
                })}
              >
                <label className="control-label" htmlFor="v_idnumber">
                  身份证
                </label>
                {nationId ? (
                  <input
                    type="text"
                    className="form-control"
                    id="v_idnumber"
                    disabled={true}
                    value={nationId}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="v_idnumber"
                    placeholder="身份证"
                    onChange={this.onChange('v_idnumber')}
                  />
                )}
                {errors.v_idnumber && (
                  <span className="help-block">请输入身份证</span>
                )}
              </div>
              <div
                className={classNames('form-group', {
                  'has-warning': errors.v_pmode
                })}
              >
                <label className="control-label">银行</label>

                {
                  <div>
                    {bankId ? (
                      <div className="bank">
                        <input
                          type="radio"
                          name="v_pmode"
                          value={bankId}
                          defaultChecked
                          readOnly
                        />
                        <label className={'bank_title bank_' + bankId}>
                          {BANKS[bankId]}
                        </label>
                      </div>
                    ) : (
                      <div onChange={this.onChange('v_pmode')}>
                        {BANKS_ARRAY.map(({ id, name }) => (
                          <div key={id} className="bank">
                            <input
                              type="radio"
                              id={'bank_input_' + id}
                              name="v_pmode"
                              value={id}
                            />
                            <label
                              htmlFor={'bank_input_' + id}
                              className={'bank_title bank_' + id}
                            >
                              {name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                }

                {errors.v_pmode && (
                  <span className="help-block">请选择银行</span>
                )}
              </div>

              <button type="submit" className="btn btn-success btn-lg">
                &nbsp;&nbsp; 去网银支付 &nbsp;&nbsp;
              </button>

              <div className="page-header lat-page-header info">
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
                        <td>注册公司</td>
                        <td>{orgName}</td>
                      </tr>
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
                          {!isStudyPay && <td>{currentRate}</td>}
                          {isStudyPay && (
                            <td>
                              {marginRate > 0
                                ? numeral(marginRate)
                                  .divide(100)
                                  .add(1)
                                  .multiply(currentRate)
                                  .value()
                                : 0}
                            </td>
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="small">若您的转款未成功，可能由于以下原因：</p>
              <p className="small">
                1.
                金额超出网银交易转款上限或账户余额，建议您登录网上银行提高最高上限额度并确保账户余额足以转款。
              </p>
              <p className="small">
                2.
                部分浏览器与银行系统存在兼容性冲突导致转款失败，建议您使用最新版本的IE浏览器进行转款操作。
              </p>
              <p className="small">
                3.
                网银页面等提示"页面过期、超时、错误"等问题时，建议您关闭浏览器后重新打开再进行转款。
              </p>
            </form>
          </div>
        </div>
        {/*form post to gateway*/}
        <div ref={ref => (this.form = ref)}>
          <style jsx>{`
            div {
              margin-top: 5rem;
            }
          `}</style>
        </div>
      </Page>
    );
  }
}
export default OnlineBank;
