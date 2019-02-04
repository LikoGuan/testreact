import React from 'react';
import { Field, reduxForm } from 'redux-form';

// import * as formValidations from './formValidations';
import { renderInput } from './Fields';
import Button from 'react-toolbox/lib/button/Button';

export const LoginForm = props => {
  const { handleSubmit, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field id="email" name="email" type="email" component={renderInput} label="Email" />
      <Field
        id="password"
        name="password"
        type="password"
        component={renderInput}
        label="Password"
      />
      <Button label="Login" type="submit" disabled={submitting} raised primary />
    </form>
  );
};

export default reduxForm({
  form: 'login',
})(LoginForm);
