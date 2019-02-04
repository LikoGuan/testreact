import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as formValidations from './formValidations';
import { renderInput, renderSelect } from './Fields';
import { CURRENCIES } from '../constants';

const validators = formValidations.createValidator({
  type: [formValidations.required],
  currency: [formValidations.required],
  companyName: [formValidations.required, formValidations.maxLength(100)],
  userName: [formValidations.required, formValidations.maxLength(100)],
  email: [
    formValidations.required,
    formValidations.email,
    formValidations.maxLength(50)
  ],
  password: [formValidations.required, formValidations.password],
  phoneNum: [formValidations.required, formValidations.maxLength(20)]
});
const convert = onSubmit => form => {
  form.individual = form.type === '1';
  // form.type = '0';
  onSubmit(form);
};
export const SignUpForm = props => {
  const { handleSubmit, submitting, type, onSubmit } = props;
  return (
    <form onSubmit={handleSubmit(convert(onSubmit))}>
      <Field
        id="type"
        name="type"
        component={renderSelect}
        options={['Company'].map((type, i) => ({
          value: i,
          text: type
        }))}
        label="Account type"
      />
      <Field
        id="currency"
        name="currency"
        component={renderSelect}
        options={Object.keys(CURRENCIES)
          .filter(key => key !== '5')
          .map(key => ({
            value: +key,
            text: CURRENCIES[key].code
          }))}
        label="Currency"
      />
      {type === '0' && (
        <Field
          id="companyName"
          name="companyName"
          type="text"
          component={renderInput}
          label="Company name"
        />
      )}
      <Field
        id="userName"
        name="userName"
        type="text"
        component={renderInput}
        label="Your full name"
      />
      <Field
        id="email"
        name="email"
        type="email"
        component={renderInput}
        label="Email"
      />
      <Field
        id="password"
        name="password"
        type="password"
        component={renderInput}
        label="Password"
      />

      <Field
        id="phoneNum"
        name="phoneNum"
        type="text"
        component={renderInput}
        label="Phone"
      />

      <button type="submit" className="btn btn-primary " disabled={submitting}>
        Join
      </button>
      {type && (
        <div className="form-group">
          <small>
            By creating an account, you agree to Latipay's &nbsp;
            <a
              className="lat-sm-links"
              target="_blank"
              rel="noopener noreferrer"
              href="Merchant Terms and Conditions.pdf"
            >
              Terms and conditions
            </a>
          </small>
        </div>
      )}
      <div className="form-group">
        <Link className="btn btn-primary btn-sm lat-links" to="/login">
          Log in now >
        </Link>
      </div>
    </form>
  );
};

const selector = formValueSelector('signup');
export default connect(state => ({
  type: selector(state, 'type')
}))(
  reduxForm({
    form: 'signup',
    validate: validators,
    initialValues: {
      type: '0'
    }
  })(SignUpForm)
);
