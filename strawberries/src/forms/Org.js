import React from 'react';
import { Field, reduxForm } from 'redux-form';

import * as formValidations from './formValidations';
import { renderInput } from './Fields';

const validators = formValidations.createValidator({
  name: [formValidations.required],
  phone: [formValidations.required, formValidations.maxLength(20)],
  email: [formValidations.required, formValidations.email],
});

export const OrgForm = props => {
  const { handleSubmit, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field id="name" name="name" type="text" component={renderInput} label="Name" />
      <Field id="phone" name="phone" type="text" component={renderInput} label="Phone" />
      <Field id="email" name="email" type="email" component={renderInput} label="Email" />
      <Field id="country" name="country" type="text" component={renderInput} label="Country" />
      <Field id="city" name="city" type="text" component={renderInput} label="City" />
      <Field id="suburb" name="suburb" type="text" component={renderInput} label="Suburb" />
      <Field id="street" name="street" type="text" component={renderInput} label="Street" />
      <Field id="zipcode" name="zipcode" type="text" component={renderInput} label="Zip code" />

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        Submit
      </button>
    </form>
  );
};

export default reduxForm({
  form: 'org',
  validate: validators,
})(OrgForm);
