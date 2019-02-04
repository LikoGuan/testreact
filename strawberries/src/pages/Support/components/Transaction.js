import React from 'react';
import classnames from 'classnames';

const Component = ({ product, changeState }) => (
  <div className="sp-product">
    <h3>How do I make a transaction?</h3>

    <p>As a Latipay merchant you can make a payment by</p>
    <button
      className={classnames('sp-btn', {
        'sp-btn--selected': product === 'spotpay'
      })}
      onClick={changeState({ product: 'spotpay' })}
    >
      Latipay APP
    </button>
    <button
      className={classnames('sp-btn', {
        'sp-btn--selected': product === 'staticpay'
      })}
      onClick={changeState({ product: 'staticpay' })}
    >
      Latipay Static Pay
    </button>
    <button
      className={classnames('sp-btn', {
        'sp-btn--selected': product === 'ecommerce'
      })}
      onClick={changeState({ product: 'ecommerce' })}
    >
      Latipay Ecommerce Integration solution
    </button>

    {product === 'spotpay' && <Spotpay />}
    {product === 'staticpay' && <Staticpay />}
    {product === 'ecommerce' && <Ecommerce />}
  </div>
);

export default Component;

const Spotpay = () => {
  return (
    <div>
      <img className="sp-img-full" src="/sp-trans.jpg?a" alt="" />

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
          Login to <strong>‘Latipay APP’</strong> by using your
          <span className="highlight"> registered email and password.</span>
        </li>
        <li>
          Tap the button{' '}
          <img className="sp-inline-img" src="/sp-menu.jpg" alt="" /> on the
          top-left, then select <strong>‘Payment Mode’</strong>.
        </li>
        <li>
          Input the <strong>Product Amount , Reference (Optional)</strong>.
        </li>
        <li>
          Show the <strong>QR code</strong> to your customer, he/she will use
          their Wechat APP or Alipay APP to{' '}
          <strong>scan the QR code and complete the payment</strong>.
        </li>
        <li>
          The QR code also can share with your customers via email or Wechat.
        </li>
        <li>
          You can then go back to <strong>‘Home’</strong> where you can track
          your transactions via <strong>‘Transaction Records’</strong>.
        </li>
      </ul>
    </div>
  );
};

const Staticpay = () => {
  return (
    <div>
      <ul>
        <li>
          Your <strong>Latipay Static QR code</strong> should be displayed on
          the counter near your Point of Sale system.
        </li>
        <li>
          Customers can scan the <strong>Latipay Static QR code</strong> via
          their Wechat or Alipay APP.
        </li>
        <li>
          You will then need to inform your customer of the{' '}
          <strong>transaction amount</strong>.
          <br />
          Your customer then <strong>inputs the amount</strong> on their phone
          and completes the transaction.
        </li>
        <li>
          Your customer shows you the <strong>transaction confirmation</strong>{' '}
          via their phone. You can also track the transaction status via your
          Latipay APP or Latipay Merchant Portal.
        </li>
      </ul>
    </div>
  );
};

const Ecommerce = () => {
  return (
    <div>
      <ul>
        <li>
          Once your customer reaches your checkout page on your online store
          your customer selects either WeChat Pay of Alipay as a payment option.
        </li>
        <li>
          Your customer is then redirected to a{' '}
          <strong>secure QR code payment page</strong> based on the payment
          method they selected.
        </li>
        <li>Your customer then scans the QR code and completes the payment.</li>
        <li>
          The <strong>payment status</strong> will be updated in the back-end of
          your online store.
        </li>
      </ul>
    </div>
  );
};
