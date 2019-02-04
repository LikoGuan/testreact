import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, FieldArray } from "redux-form";

import * as formValidations from "./formValidations";
import { renderInput, renderSelect, renderCheckbox } from "./Fields";

const validators = formValidations.createValidator({
  userName: [formValidations.required, formValidations.maxLength(100)],
  email: [
    formValidations.required,
    formValidations.email,
    formValidations.maxLength(50)
  ],
  roleId: [formValidations.required],
  wallets: [formValidations.selectOneAtLeast]
});

export const UserForm = props => {
  const { handleSubmit, submitting, initialValues, me, constants } = props;
  const meRoleId = me.roleId;
  const isEdit = !!initialValues.userId;
  return (
    <form onSubmit={handleSubmit}>
      <Field
        id="userName"
        name="userName"
        type="text"
        component={renderInput}
        label="User name"
      />
      {!isEdit && (
        <Field
          id="email"
          name="email"
          type="email"
          component={renderInput}
          label="Email"
        />
      )}

      {(!isEdit || initialValues.roleId > meRoleId) && (
        <Field
          id="roleId"
          name="roleId"
          component={renderSelect}
          options={constants.ROLES.filter(role => role.id > meRoleId).map(
            role => ({
              value: role.id,
              text: role.name
            })
          )}
          label="Role"
        />
      )}

      <div className="form-group">
        <p className="help-block">Select which wallets the user can access:</p>
      </div>
      {(!isEdit || initialValues.roleId > meRoleId) && (
        <FieldArray
          name="wallets"
          component={({ fields, meta }) => (
            <div>
              {fields.map((wallet, i) => {
                return (
                  <Field
                    key={`${wallet}.selected`}
                    id={`${wallet}.selected`}
                    name={`${wallet}.selected`}
                    component={renderCheckbox}
                    label={fields.get(i).accountName}
                  />
                );
              })}
            </div>
          )}
        />
      )}
      <button type="submit" className="btn btn-primary " disabled={submitting}>
        Submit
      </button>
    </form>
  );
};

export default connect(({ me, constants }) => ({ me, constants }))(
  reduxForm({
    form: "user",
    validate: validators
  })(UserForm)
);
