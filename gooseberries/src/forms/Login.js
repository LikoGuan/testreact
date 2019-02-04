import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Text } from 'primitive-collections';
import * as formValidations from './formValidations';
import { renderInput } from './Fields';

const validators = formValidations.createValidator({
  email: [formValidations.required, formValidations.maxLength(50)], //formValidations.email
  password: [formValidations.required, formValidations.password]
});

export const LoginForm = props => {
  const { handleSubmit, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field
        className="login-field"
        id="email"
        name="email"
        component={renderInput}
        label="Email"
      />
      <Field
        className="login-field"
        id="password"
        name="password"
        type="password"
        component={renderInput}
        label="Password"
      />
      <Button className="login-btn" type="submit" disabled={submitting}>
        <Text>Login</Text>
      </Button>
    </form>
  );
};

export default reduxForm({
  form: 'login',
  validate: validators
})(LoginForm);
