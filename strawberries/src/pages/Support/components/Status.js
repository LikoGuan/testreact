import React from 'react';
import classnames from 'classnames';

const Component = ({ statusIn, changeState }) => (
  <div>
    <h3>How can I track my transaction status?</h3>

    <p>You can track your transaction status via:</p>

    <button
      className={classnames('sp-btn', {
        'sp-btn--selected': statusIn === 'app'
      })}
      onClick={changeState({ statusIn: 'app' })}
    >
      Latipay APP
    </button>
    <button
      className={classnames('sp-btn', {
        'sp-btn--selected': statusIn === 'merchant portal'
      })}
      onClick={changeState({ statusIn: 'merchant portal' })}
    >
      Latipay Merchant Portal
    </button>

    {statusIn === 'app' && <App />}
    {statusIn === 'merchant portal' && <Portal />}
  </div>
);

export default Component;

const App = () => (
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
      You will find your successful transactions under{' '}
      <strong>‘Transaction Records’</strong>.
    </li>
    <li>
      <strong>Tap the paticular transaction</strong> and the transaction details
      will be displayed.
    </li>
  </ul>
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
      You will find your successful transactions under{' '}
      <strong>‘Transaction History’</strong> in the <strong>‘Wallet’</strong>{' '}
      section.
    </li>
    <li>
      <strong>Tap the paticular transaction</strong> and the transaction details
      will be displayed.
    </li>
  </ul>
);
