import React from 'react';
import { Field, reduxForm } from 'redux-form';

import * as formValidations from './formValidations';
import { renderInput } from './Fields';

const validators = formValidations.createValidator({
  userName: [formValidations.required, formValidations.maxLength(100)],
});

export const MeForm = props => {
  const { handleSubmit, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field id="userName" name="userName" type="input" component={renderInput} label="User name" />
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        Submit
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'me',
  validate: validators,
})(MeForm);
