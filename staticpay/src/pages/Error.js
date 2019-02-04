import React, { Component } from 'react';

import { isWexin } from '../utils';

import { localizedText } from '../i18n';
import Footer from '../components/SupportbyFooter';

class ErrorPage extends Component {
  constructor(props) {
    super(props);

    const search = props.location.search;
    const params = new URLSearchParams(search);
    const message = params.get('message');

    this.state = {
      message,
      backPageUrl: params.get('back_page_url')
    };

    //TODO openId error
    if (isWexin) window.localStorage.removeItem('openId');
  }

  render() {
    const { message, backPageUrl } = this.state;
    return (
      <div style={{ paddingTop: 50 }}>
        <div
          style={{
            width: '70%',
            margin: '0 auto',
            boxSizing: 'border-box',
            padding: '15px',
            position: 'relative',
            borderRadius: 4,
            color: 'rgba(0, 0, 0, 0.65)',
            lineHeight: 1.5,
            border: '1px solid #ffa39e',
            backgroundColor: '#fff1f0'
          }}
        >
          <div style={{ display: 'flex' }}>
            <i
              style={{
                color: '#f5222d',
                fontSize: 24
              }}
            >
              <svg
                viewBox="64 64 896 896"
                width="1em"
                height="1em"
                fill="currentColor"
              >
                <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z" />
                <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
              </svg>
            </i>
            <span
              style={{
                fontSize: 20,
                marginLeft: 10
              }}
            >
              {localizedText('error.title')}
            </span>
          </div>
          <p>{message}</p>
        </div>

        {backPageUrl && (
          <p style={{ textAlign: 'center' }}>
            <a href={backPageUrl}>{localizedText('error.back.merchant')}</a>
          </p>
        )}

        <div style={{ height: 100 }} />

        <Footer />
      </div>
    );
  }
}

export default ErrorPage;
