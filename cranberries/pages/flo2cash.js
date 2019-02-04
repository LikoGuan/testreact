import React from 'react';
import classNames from 'classnames';
import numeral from 'numeral';
import Script from 'react-load-script';

import Page from '../components/Page';
import { flo2cashHost, flo2cashEnv } from '../config';

class Flo2Cash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

    const Flo2Cash = window.Flo2Cash;
    Flo2Cash.getToken();
  }

  handleScriptCreate = () => {
    this.setState({ scriptLoaded: false });
  };

  handleScriptError = () => {
    this.setState({ scriptError: true });
  };

  handleScriptLoad = () => {
    const Flo2Cash = window.Flo2Cash;

    const { apiKey } = this.props.url.query;
    const inputcss = `
      font-family: "Titillium Web", "PingFang SC", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif;
      font-weight: lighter;
      background-color:#4a568c;
      color:#e2e2e2;
      box-shadow:none;
      appearance:none;
      -webkit-appearance:none;
      border:none;
      width:100%;
      height:40px;
      font-size: 1.05em;
      letter-spacing: 1px;
      padding-left: 9px;
      padding-right: 9px;
      `;

    // this.setState({ scriptLoaded: true });
    Flo2Cash.initialise(
      apiKey,
      {
        id: 'my-payment-form',
        tokenField: 'f2c-token',
        mode: flo2cashEnv,
        inputFields: {
          number: {
            id: 'f2c-card-number',
            style: inputcss
          },
          cvv: {
            id: 'f2c-cvv',
            style: inputcss
          },
          expiryDate: {
            id: 'f2c-expiry-date',
            'style-month': inputcss,
            'style-year': inputcss
          },
          nameOnCard: {
            id: 'f2c-name-on-card',
            style: inputcss
          }
        }
      },
      function(errors) {
        console.log('errors', errors);
      }
    );

    Flo2Cash.register('onTokenisation', evt => {
      const { token } = evt;
      if (token) {
        document.getElementById('my-payment-form').submit();
      } else {
        this.setState({
          error: 'Token Error'
        });
      }

      // console.log('onTokenisation', evt)
      // {token: "d8dba08f-be3d-4c57-91f7-a87e00bf3594", cardScheme: "mastercard"}
    });

    Flo2Cash.register('onError', errors => {
      //[{"id":"number","type":"input.validation","message":"Credit card number is blank"},{"id":"cvv","type":"input.validation","message":"CVV number length is invalid. it should be exactly 3 chars long "},{"id":"name","type":"input.validation","message":"Card holder name is Blank"},{"id":"expiry-month","type":"input.validation","message":"Expiry month is blank"},{"id":"expiry-year","type":"input.validation","message":"Expiry year is blank"}]
      // alert(JSON.stringify(errors));

      const errState = {};

      for (var i = 0; i < errors.length; i++) {
        var err = errors[i],
          id = err.id;
        errState[id] = err.message;
      }
      this.setState({
        errors: errState
      });
    });

    Flo2Cash.register('onReady', () => {});

    Flo2Cash.register('onFieldChange', evt => {
      if (evt.type === 'blur') {
        var id = evt.id;
        var data = evt.data || {};
        if (data.type !== 'input.validation') return;

        var valid = data.valid;
        var message = data.message || '';
        this.setState({
          errors: {
            ...this.state.errors,
            [id]: !valid ? message : ''
          }
        });
      }
    });
  };

  render() {
    const { transaction, apiKey } = this.props.url.query;
    const {
      orgName,
      amount,
      amountCNY,
      currency,
      productName,
      customerOrderId,
      isPayerPayFee,
      marginRate,
      walletName,
      shifoushicnm,
      nonce
    } =
      transaction.paydata || {};

    const { errors } = this.state;

    if (!apiKey) {
      return <Page>Flo2Cash unavailable</Page>;
    }

    return (
      <Page>
        {apiKey && (
          <Script
            url={`https://${flo2cashHost}/integration/iframe/js/f2c-iframe-0.0.2.js`}
            onCreate={this.handleScriptCreate}
            onError={this.handleScriptError}
            onLoad={this.handleScriptLoad}
          />
        )}

        <div className="row">
          <div className="col-sm-6 col-sm-8  col-sm-offset-3 col-md-offset-2">
            <h2>Flo2Cash payment</h2>

            <h5>{walletName}</h5>

            {!shifoushicnm && (
              <h2>
                ${' '}
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

            {isPayerPayFee && <sup>Latipay将收取{marginRate}%的手续费</sup>}
            <form
              id="my-payment-form"
              action="/flo2cash/payment"
              method="post"
              onSubmit={this.onSubmit}
            >
              <input type="hidden" id="f2c-token" name="f2c-token" />
              <input type="hidden" name="nonce" value={nonce} />

              <style jsx>
                {`
                  form {
                    margin-top: 2rem;
                  }
                  .form-group {
                    height: 100px;
                  }
                  .form-group label {
                    height: 0;
                    margin: 0;
                    font-size: 1.05em;
                  }
                  .form-group .field {
                    height: 40px;
                  }
                  .form-group span {
                    height: 30px;
                    margin: 0;
                  }
                `}
              </style>

              <div
                className={classNames('form-group', {
                  'has-warning': errors.number
                })}
              >
                <label className="control-label" htmlFor="v_idname">
                  Card Number
                </label>
                <div id="f2c-card-number" className="field" />

                {errors.number && (
                  <span className="help-block">{errors.number}</span>
                )}
              </div>

              <div
                className={classNames('form-group', {
                  'has-warning': errors.cvv
                })}
              >
                <label className="control-label" htmlFor="v_idnumber">
                  CVV
                </label>
                <div id="f2c-cvv" className="field" />
                {errors.cvv && <span className="help-block">{errors.cvv}</span>}
              </div>

              <div
                className={classNames('form-group expiration-month', {
                  'has-warning': errors['expiry-month'] || errors['expiry-year']
                })}
              >
                <label className="control-label" htmlFor="v_idnumber">
                  Expiration Month and Year
                </label>
                <div id="f2c-expiry-date" className="field" />
                {(errors['expiry-month'] || errors['expiry-year']) && (
                  <span className="help-block">
                    {errors['expiry-month']
                      ? errors['expiry-month'] + '; '
                      : ''}
                    {errors['expiry-year']}
                  </span>
                )}
              </div>

              <div
                className={classNames('form-group', {
                  'has-warning': errors.name
                })}
              >
                <label className="control-label" htmlFor="v_idnumber">
                  Name on Card
                </label>
                <div id="f2c-name-on-card" className="field" />
                {errors.name && (
                  <span className="help-block">{errors.name}</span>
                )}
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
                    </tbody>
                  </table>
                </div>
              </div>
              <button type="submit" className="btn btn-success btn-lg">
                &nbsp;&nbsp; 付款 &nbsp;&nbsp;
              </button>
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
export default Flo2Cash;
