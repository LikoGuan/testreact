import React from 'react';
import successLog from '../../assets/success.svg';

import { CURRENCIES_CODE_SIGN } from '../../constants';
import { getDateDisplay } from '../../utils';

import './index.css';

const Receipt = ({
  amount,
  payAmountCNY,
  currency,
  status,
  paymentMethod,
  createDate,
  orderId
}) => {
  let date;
  if (createDate) {
    date = new Date(createDate.replace(' ', 'T') + 'Z');
  } else {
    date = new Date();
  }
  const dateString = getDateDisplay(date);

  return (
    <div className="merchant-receipt-card">
      <div className="merchant-receipt-head">
        <h2 className="merchant-receipt-title">Payment success</h2>
        <img src={successLog} alt="success" />
      </div>

      <div className="merchant-receipt-row">
        <div>Transaction ID</div>
        <div className="merchant-receipt-row-value green">{orderId}</div>
      </div>

      <div className="merchant-receipt-row">
        <div>Amount</div>
        <div className="merchant-receipt-row-value">
          <span className="green">
            {CURRENCIES_CODE_SIGN[currency]}
            {amount} {currency}
          </span>{' '}
          (¥{payAmountCNY} CNY)
        </div>
      </div>

      <div className="merchant-receipt-row">
        <div>Payment method</div>
        <div className="merchant-receipt-row-value">{paymentMethod}</div>
      </div>

      <div className="merchant-receipt-line">
        <hr />
      </div>

      <div className="merchant-receipt-row">
        <div>Proccessed on</div>
        <div className="merchant-receipt-row-value">{dateString}</div>
      </div>
    </div>
  );
};

export default ({ successResult, onNewPayment }) => {
  const receipt = Receipt(successResult);

  return (
    <div className="merchant-receipt">
      <div className="merchant-receipt-container">
        <div className="merchant-receipt-slot" />
        {receipt}
      </div>
      <button className="merchant-receipt-new" onClick={onNewPayment}>
        CREATE NEW PAYMENT
      </button>
    </div>
  );
};
