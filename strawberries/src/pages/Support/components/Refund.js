import React from 'react';
import classnames from 'classnames';

const Component = ({ refundIn, changeState }) => (
  <div>
    <h3>How do I perform refund?</h3>

    <p>You can perform a refund via:</p>

    <button
      className={classnames('sp-btn', {
        'sp-btn--selected': refundIn === 'app'
      })}
      onClick={changeState({
        refundIn: 'app'
      })}
    >
      Latipay APP
    </button>
    <button
      className={classnames('sp-btn', {
        'sp-btn--selected': refundIn === 'merchant portal'
      })}
      onClick={changeState({
        refundIn: 'merchant portal'
      })}
    >
      Latipay Merchant Portal
    </button>

    {refundIn === 'app' && <App />}
    {refundIn === 'merchant portal' && <Portal />}
  </div>
);

export default Component;

const App = () => (
  <div>
    <img className="sp-img-full" src="/sp-refund.jpg" alt="" />
    <ul>
      <li>
        Download the <strong>‘Latipay APP’</strong> via{' '}
        <a
          href="https://itunes.apple.com/us/app/latipay/id1384312904"
          target="__blank"
        >
          Apple store
        </a>{' '}
        or{' '}
        <a
          href="https://play.google.com/store/apps/details?id=net.latipay.latipay"
          target="__blank"
        >
          Google Play.
        </a>
      </li>
      <li>
        Login to <strong>‘Latipay APP’</strong> by using your{' '}
        <span className="highlight">registered email and password</span>.
      </li>
      <li>
        Tap your <strong>paticular transaction</strong> via{' '}
        <strong>‘Transaction Records’</strong>.
      </li>
      <li>
        The transaction details will be displayed, tap the{' '}
        <strong>Refund button</strong> on the bottom. (Please note that the
        ‘Refund’ button is greyed out for users without manager status)
      </li>
      <li>
        <strong>Input the reference</strong> then perform the refund.
      </li>
      <li>
        The funds then be transferred back to your customers Wechat or Alipay
        e-wallet <strong>in real-time</strong>.
      </li>
    </ul>
  </div>
);

const Portal = () => (
  <ul>
    <li>
      Login to{' '}
      <strong>
        <a href="/login" className="sp-link" target="__blank">
          ‘Latipay Merchant Portal’
        </a>
      </strong>{' '}
      by using your{' '}
      <span className="highlight">registered email and password</span>.
    </li>
    <li>
      Tap your paticular transaction via <strong>‘Transaction History’</strong>{' '}
      under the <strong>‘Wallet’</strong> section.
    </li>
    <li>
      The transaction details will be displayed, tap the{' '}
      <strong>Refund button</strong> on the bottom.
    </li>
    <li>
      <strong>Input the reference</strong> then perform the refund.
    </li>
    <li>
      The funds will be transferred back to your customers Wechat or Alipay
      e-wallet <strong>in realtime</strong>.
    </li>
  </ul>
);
