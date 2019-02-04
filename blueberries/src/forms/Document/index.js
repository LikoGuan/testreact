import React from 'react';
import { reduxForm, FormSection, FieldArray } from 'redux-form';

import Button from 'react-toolbox/lib/button/Button';
import Registration from './Registration';
import Individual from './Individual';
import Representative from './Representative';
import Shareholder from './Shareholder';
import BankAccount from './BankAccount';

export const DocumentForm = props => {
  const { handleSubmit, submitting, initialValues = {} } = props;
  const { merchantType } = initialValues;
  const isCompany = merchantType === 1;
  return (
    <form onSubmit={handleSubmit}>
      {isCompany &&
        <FormSection name="registration">
          <Registration />
        </FormSection>}
      {isCompany &&
        <FieldArray name="representatives" component={Representative} />}
      {isCompany && <FieldArray name="shareholders" component={Shareholder} />}
      {!isCompany &&
        <FormSection name="individual">
          <Individual />
        </FormSection>}
      <FieldArray name="bankaccounts" component={BankAccount} />
      <Button label="Save" type="submit" disabled={submitting} raised primary />
    </form>
  );
};

export default reduxForm({
  form: 'document',
})(DocumentForm);
