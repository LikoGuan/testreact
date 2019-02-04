import React from 'react';
import classnames from 'classnames';

const Component = ({ settleIn, withdraw, changeState }) => (
  <div>
    <h3>How do I settle funds to my local bank account?</h3>
    <p>We provide two settlement types (Manual/Auto)</p>

    <div>
      <input
        id="manu"
        type="radio"
        value="manu"
        checked={withdraw === 'manu'}
        onChange={changeState({
          withdraw: 'manu'
        })}
      />
      <label htmlFor="manu">Manual withdraw</label>

      <input
        id="auto"
        type="radio"
        value="auto"
        checked={withdraw === 'auto'}
        onChange={changeState({
          withdraw: 'auto'
        })}
      />
      <label htmlFor="auto">Auto withdraw</label>
    </div>

    {withdraw === 'manu' && (
      <div>
        <button
          className={classnames('sp-btn', {
            'sp-btn--selected': settleIn === 'app'
          })}
          onClick={changeState({ settleIn: 'app' })}
        >
          Latipay APP
        </button>
        <button
          className={classnames('sp-btn', {
            'sp-btn--selected': settleIn === 'merchant portal'
          })}
          onClick={changeState({
            settleIn: 'merchant portal'
          })}
        >
          Latipay Merchant Portal
        </button>
      </div>
    )}

    {withdraw === 'manu' && settleIn === 'app' && <AppManu />}
    {withdraw === 'manu' && settleIn === 'merchant portal' && <PortalManu />}

    {withdraw === 'auto' && <Auto />}
  </div>
);

export default Component;

const AppManu = () => (
  <div>
    <img className="sp-img-full" src="/sp-settle.jpg?a" alt="" />

    <ul>
      <li>
        Download our <strong>‘Latipay APP’</strong> via{' '}
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
        Tap <strong>‘Withdraw’</strong> button on the home page to{' '}
        <strong>create a withdraw transaction</strong>.
      </li>
      <li>
        Select your Latipay account and settle bank account then type in the
        reference and <strong>submit the withdrawal</strong>.
      </li>
      <li>
        Our Finance Team will handle the withdrawal once you submit, the funds
        will be processed to your local bank account within{' '}
        <strong>3 business days</strong>.
      </li>
      <li>
        You can <strong>track your withdrawals</strong> via{' '}
        <strong>Menu > Withdraw</strong>.
      </li>
    </ul>
  </div>
);

const PortalManu = () => (
  <ul>
    <li>
      Login{' '}
      <strong>
        <a href="/login" className="sp-link" target="__blank">
          ‘Latipay Merchant Portal’
        </a>
      </strong>{' '}
      by using your{' '}
      <span className="highlight">registered email and password</span>.
    </li>
    <li>
      Tap the <strong>‘Withdraw’</strong> button on the{' '}
      <strong>‘Account’</strong> page to{' '}
      <strong>create a withdraw transaction</strong>.
    </li>
    <li>
      Select your Latipay account and settle bank account then type in the
      reference and <strong>submit the withdrawal</strong>.
    </li>
    <li>
      Our Latipay Finance Team will handle the withdrawal once you submit, the
      funds will be processed to your local bank account within{' '}
      <strong>3 business days</strong>.
    </li>
    <li>
      You can <strong>track your withdrawals</strong> via{' '}
      <strong>Account > Transaction > History</strong> by selecting{' '}
      <strong>‘Type’</strong> as <strong>‘Withdrawals’</strong>.
    </li>
  </ul>
);

const Auto = () => (
  <ul>
    <li>
      Upon signing up with Latipay, you will be able to choose your preferred
      auto-settlement routine, <strong>(Daily, Weekly or Monthly)</strong>.
      <p className="sp-withdraw-time">
        <span style={{ width: '30px', display: 'inline-block' }}>e.g. </span>
        <strong>Daily</strong> at <span className="highlight">5:00 PM</span>
      </p>
      <p
        className="sp-withdraw-time"
        style={{
          paddingLeft: '30px'
        }}
      >
        <strong>Weekly</strong> at{' '}
        <span className="highlight">5:00 PM on Friday</span>
      </p>
      <p
        className="sp-withdraw-time"
        style={{
          paddingLeft: '30px'
        }}
      >
        <strong>Monthly</strong> at{' '}
        <span className="highlight">5:00PM on 30th</span>
      </p>
    </li>
    <li>
      We will provide{' '}
      <strong>daily, weekly or monthly transaction reports</strong> to the email
      address you provide us with.
    </li>
    <li>
      Contact our <strong>Latipay Support Team</strong> via the{' '}
      <strong>‘Contact Us’</strong> button at the bottom of this page with the
      above information if you’d like to switch to the{' '}
      <strong>Auto withdraw function</strong>.
    </li>
  </ul>
);
