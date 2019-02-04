import React from 'react';
import { Field, reduxForm } from 'redux-form';

import * as formValidations from './formValidations';
import { renderInput } from './Fields';

const validators = formValidations.createValidator({
  email: [formValidations.required, formValidations.email, formValidations.maxLength(50)],
});

export const ResetPwdForm = props => {
  const { handleSubmit, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <p>If you’ve forgotten your password, we can send a reset link to your email address.</p>
      <p>
        If you don’t have access to your email address any longer, please email &nbsp;
        <a className="lat-sm-links" href="mailto:support@latipay.net">
          support@latipay.net
        </a>
        &nbsp;and we will be in touch.
      </p>

      <Field id="email" name="email" type="email" component={renderInput} label="Email" />
      <button type="submit" className="btn btn-primary " disabled={submitting}>
        Reset
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'resetpwd',
  validate: validators,
})(ResetPwdForm);
