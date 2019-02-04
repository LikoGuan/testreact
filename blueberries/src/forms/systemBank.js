import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { renderInput, renderDropdown } from './Fields';
import Button from 'react-toolbox/lib/button/Button';

export const SystemBankForm = props => {
  const { handleSubmit, submitting, constants, isEdit=false} = props;

  const required = value => value ? undefined : 'Required';

  return (
    <div className="scroll-y">
      <form onSubmit={handleSubmit}>
        <Field
          name="country"
          type="text"
          component={renderDropdown}
          source={constants.lookups.countries}
          label="Country *"
          validate={[ required]}
        />
        <Field id="accountName" name="accountName" validate={[ required]} type="text" component={renderInput} label="Account name *" disabled={isEdit}/>
        <Field id="accountNumber" name="accountNumber" validate={[ required]} type="text" component={renderInput} label="Account number *" disabled={isEdit}/>
        <Field id="bankName" name="bankName" type="text" validate={[ required]} component={renderInput} label="Bank name *" />
        <Field id="bankAddress" name="bankAddress" type="text" validate={[ required]} component={renderInput} label="Bank address *" />
        <Field id="city" name="city" type="text" component={renderInput} validate={[ required]} label="City *" />

        <Field id="amount" name="amount" type="text" component={renderInput} label="Amount" disabled={isEdit} />
        <Field name="currency" component={renderDropdown} source={constants.lookups.currencies} label="Currency" />
        <Field id="swiftCode" name="swiftCode" type="text" component={renderInput} label="Swift Code" />
        <Field
          id="intermediaryBank"
          name="intermediaryBank"
          type="text"
          component={renderInput}
          label="Intermediary bank"
        />
        <Field id="note" name="note" type="text" component={renderInput} label="Note" />

        <Button label="Submit" type="submit" disabled={submitting} raised primary />
      </form>
    </div>
  );
};

export default connect(({ constants }) => ({ constants }))(
  reduxForm({
    form: 'systembank',
  })(SystemBankForm)
);
