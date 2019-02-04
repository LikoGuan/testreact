import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { renderCheckbox } from './Fields';

export const NotificationForm = props => {
  const { submitting, handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="page-header lat-page-header">
        <div className="row">
          <p>Payment Notifications</p>
          <div className="lat-header-op" />
        </div>
      </div>
      <div className="">
        {/*<div className="row">
          <div className="col-md-8">
            <h5> Invoice payments</h5>
            <p>Receive a notification for every successful invoice payment</p>
          </div>
          <div className="col-md-4">
            <Field id="invoice" name="invoice" component={renderCheckbox} label="Email" />
          </div>
        </div>*/}
        <div className="row">
          <div className="col-md-8">
            <h5> Settlements</h5>
            <small>
              Receive a notification for every successful transaction
            </small>
          </div>
          <div className="col-md-4">
            <Field
              id="settlement"
              name="settlement"
              component={renderCheckbox}
              label="Email"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <h5> Online payments</h5>
            <small>
              Receive a notification for every successful online payment
            </small>
          </div>
          <div className="col-md-4">
            <Field
              id="online"
              name="online"
              component={renderCheckbox}
              label="Email"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <h5> Invoices</h5>
            <small>Receive a notification for every successful invoice</small>
          </div>
          <div className="col-md-4">
            <Field
              id="invoice"
              name="invoice"
              component={renderCheckbox}
              label="Email"
            />
          </div>
        </div>
      </div>

      <div className="page-header lat-page-header">
        <div className="row">
          <p>General Notifications</p>
          <div className="lat-header-op" />
        </div>
      </div>
      <div className="">
        <div className="row">
          <div className="col-md-8">
            <h5> System update</h5>
            <small>
              Receive a notification for every Latipay system update
            </small>
          </div>
          <div className="col-md-4">
            <Field
              id="system"
              name="system"
              component={renderCheckbox}
              label="Email"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <h5> News and promotions</h5>
            <small>Receive a notification for every Latipay activities</small>
          </div>
          <div className="col-md-4">
            <Field
              id="activity"
              name="activity"
              component={renderCheckbox}
              label="Email"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <h5> Merchant/wallet details change</h5>
            <small>
              Receive a notification for every your Latipay account changes
            </small>
          </div>
          <div className="col-md-4">
            <Field
              id="account"
              name="account"
              component={renderCheckbox}
              label="Email"
            />
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        Submit
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'notifications'
})(NotificationForm);
