import React, { Component } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { locale, messages, localizedText } from '../i18n';

import { getDateDisplay } from '../utils';

//import adImg from '../assets/ads_latipay.png';
import adImg2 from '../assets/ads_chinapayment.gif';
import adImg from '../assets/ads_app.png';
// import { mingyuan_ads } from '../constants';

import logo from '../assets/logo.svg';

require('intl');

const _Logo = props => <img src={logo} alt="latipay" {...props} />;

const Logo = styled(_Logo)`
  vertical-align: middle;
  padding-left: 10px;
  height: 50%;
  opacity: 0.8;
  color: #888888;
`;

class StaticQRConfirmation extends Component {
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const payment_method = params.get('payment_method') || '';
    const order_id = params.get('order_id');
    const status = params.get('status');

    //app来的Invoice单才跳转
    if (payment_method.toLowerCase() === 'polipay') {
      window.location.href = `latipaycustomer://polipay?id=${order_id}&status=${status}`;
    }
  }

  render() {
    const params = new URLSearchParams(this.props.location.search);
    const payment_method = params.get('payment_method');

    const amount = params.get('amount');
    const currency = params.get('currency');
    const status = params.get('status');
    const createDate = params.get('createDate');
    const order_id = params.get('order_id');
    const noads = params.get('noads') || 'false';

    let date;
    if (createDate) {
      date = new Date(createDate.replace(' ', 'T') + 'Z');
    } else {
      date = new Date();
    }
    const dateString = getDateDisplay(date);

    const adsMap = {
      AUD: {
        title: 'ChinaPayments',
        src: adImg2
      }
    };

    const adsDefault = {
      title: '钱多多',
      src: adImg
    };

    const ads = adsMap[currency] || adsDefault;

    let title = localizedText('staticqr.loading');
    const isPaid =
      order_id !== undefined && order_id !== '' && status === 'paid';

    if (order_id === undefined || order_id === '') {
      title = localizedText('confirm.invalid');
    } else {
      if (isPaid) {
        title = localizedText('confirm.successful');
      } else {
        title = localizedText('confirm.unpaid');
      }
    }

    const isStaging =
      window.location.hostname.indexOf('staging.latipay.net') !== -1;

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div>
          <div className="confirm-receipt">
            <div className="confirm-head">
              {isPaid && (
                <svg
                  width="36px"
                  height="36px"
                  viewBox="0 0 68 68"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    id="Static-QR-code"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="new-payment_select-copy-4"
                      transform="translate(-154.000000, -90.000000)"
                      fill="#89C68B"
                    >
                      <g
                        id="Group-3"
                        transform="translate(15.000000, -182.000000)"
                      >
                        <g
                          id="Group-5"
                          transform="translate(139.000000, 272.000000)"
                        >
                          <path
                            d="M34,68 C15.2223185,68 0,52.7776815 0,34 C0,15.2223185 15.2223185,0 34,0 C52.7776815,0 68,15.2223185 68,34 C68,52.7776815 52.7776815,68 34,68 Z M34,64 C50.5685425,64 64,50.5685425 64,34 C64,17.4314575 50.5685425,4 34,4 C17.4314575,4 4,17.4314575 4,34 C4,50.5685425 17.4314575,64 34,64 Z"
                            id="Combined-Shape"
                          />
                          <g
                            id="Group-3"
                            transform="translate(33.877260, 30.931507) rotate(45.000000) translate(-33.877260, -30.931507) translate(22.808767, 13.397260)"
                          >
                            <rect
                              id="Rectangle-6"
                              x="0"
                              y="30.6849315"
                              width="20.8087671"
                              height="4.38356164"
                            />
                            <rect
                              id="Rectangle-6-Copy"
                              x="17.709589"
                              y="0"
                              width="4.42739726"
                              height="35.0684932"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              )}

              {!isPaid && (
                <svg
                  width="36px"
                  height="36px"
                  viewBox="0 0 68 68"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    id="Static-QR-code"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <g
                      id="new-payment_select-copy-5"
                      transform="translate(-154.000000, -90.000000)"
                      fill="#C1C1C1"
                    >
                      <g
                        id="Group-3"
                        transform="translate(15.000000, -182.000000)"
                      >
                        <g
                          id="Group-5"
                          transform="translate(139.000000, 272.000000)"
                        >
                          <path
                            d="M34,68 C15.2223185,68 0,52.7776815 0,34 C0,15.2223185 15.2223185,0 34,0 C52.7776815,0 68,15.2223185 68,34 C68,52.7776815 52.7776815,68 34,68 Z M34,64 C50.5685425,64 64,50.5685425 64,34 C64,17.4314575 50.5685425,4 34,4 C17.4314575,4 4,17.4314575 4,34 C4,50.5685425 17.4314575,64 34,64 Z"
                            id="Combined-Shape"
                          />
                          <path
                            d="M48.8467726,49.8908921 C49.0514827,49.961599 49.2712568,50 49.5,50 C50.6045695,50 51.5,49.1045695 51.5,48 C51.5,47.2771082 51.1164762,46.6437933 50.5418039,46.2924304 C50.549675,46.2828486 50.5575655,46.2732834 50.5654754,46.2637347 C45.659608,43.5472724 40.0112381,42 34,42 C27.998904,42 22.3594528,43.5420557 17.4593624,46.2499951 C17.4687437,46.2582718 17.4781076,46.2665677 17.4874541,46.2748828 C16.8965782,46.6224423 16.5,47.2649083 16.5,48 C16.5,49.1045695 17.3954305,50 18.5,50 C18.7287432,50 18.9485173,49.961599 19.1532274,49.8908921 C19.3494054,49.7800087 19.5469561,49.6712549 19.7458477,49.5646623 C19.7666204,49.5481004 19.787056,49.5311334 19.8071424,49.5137733 C19.8092194,49.5187101 19.8112921,49.5236492 19.8133605,49.5285905 C24.0408501,47.2767649 28.8707108,46 34,46 C39.398301,46 44.4649422,47.4141998 48.8467726,49.8908921 Z"
                            id="Combined-Shape-Copy"
                          />
                          <circle id="Oval-2" cx="23" cy="28" r="4" />
                          <circle id="Oval-2-Copy" cx="44" cy="28" r="4" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              )}

              <div
                className={
                  isPaid
                    ? 'confirm-head--status'
                    : 'confirm-head--status confirm-head--status__failed'
                }
              >
                {title}
              </div>
            </div>
            <div className="confirm-row">
              <FormattedMessage id="staticqr.amount" />
              <div className="confirm-row-value">
                {amount}
                {currency}
              </div>
            </div>
            <div className="confirm-row">
              <FormattedMessage id="confirm.method" />
              <div className="confirm-row-value">{payment_method}</div>
            </div>
            <div className="confirm-row">
              <FormattedMessage id="confirm.created" />
              <div className="confirm-row-value">{dateString}</div>
            </div>
            <div className="confirm-row">
              <FormattedMessage id="confirm.transaction.id" />
              <div className="confirm-row-value">{order_id}</div>
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#888',
                height: 45,
                background: 'white',
                paddingTop: 15
              }}
            >
              <span>Supported by</span>
              <Logo />
            </div>
          </div>

          {noads === 'false' && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              {ads.href && (
                <a
                  className="confirm-footer-anz"
                  href={`https://merchant${
                    isStaging ? '-staging' : ''
                  }.latipay.net/ads?url=${
                    ads.href
                  }&id=${order_id}&amount=${amount}`}
                >
                  <img src={ads.src} alt={ads.title} />
                </a>
              )}

              {!ads.href && (
                <a
                  className="confirm-footer-anz"
                  href="https://itunes.apple.com/us/app//id1438357209"
                >
                  <img src={ads.src} alt={ads.title} />
                </a>
              )}
            </div>
          )}
        </div>
      </IntlProvider>
    );
  }
}

export default StaticQRConfirmation;
