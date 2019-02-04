import React from 'react';
import { Field, reduxForm } from 'redux-form';

import * as formValidations from './formValidations';
import { renderInput } from './Fields';

const validators = formValidations.createValidator({
  password: [formValidations.required, formValidations.password],
  password2: [formValidations.required, formValidations.match('password')],
});

export const SetPwdForm = props => {
  const { handleSubmit, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field id="password" name="password" type="password" component={renderInput} label="New password" />
      <Field id="password2" name="password2" type="password" component={renderInput} label="Confirm password" />

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        Submit
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'setpwd',
  validate: validators,
})(SetPwdForm);
