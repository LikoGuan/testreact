import React from "react";
import { Field, reduxForm } from "redux-form";

import { renderInput } from "./Fields";
import * as formValidations from "./formValidations";

const validators = formValidations.createValidator({
  accountName: [formValidations.required, formValidations.maxLength(50)]
});

export const WalletForm = props => {
  const { handleSubmit, submitting } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field
        id="name"
        name="accountName"
        type="input"
        component={renderInput}
        label="Name"
      />

      <button type="submit" className="btn btn-primary " disabled={submitting}>
        Submit
      </button>
    </form>
  );
};

export default reduxForm({
  form: "wallet",
  validate: validators
})(WalletForm);
