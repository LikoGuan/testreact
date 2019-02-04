import React from "react";
import {FormattedMessage} from "react-intl";
import {Field, reduxForm} from "redux-form";
import {Link} from "react-router-dom";

import * as formValidations from "./formValidations";
import {renderInput} from "./Fields";

const validators = formValidations.createValidator({
    email: [formValidations.required, formValidations.maxLength(50)], //formValidations.email
    password: [formValidations.required]
});
export const LoginForm = props => {
    const {handleSubmit, submitting} = props;
    return (
        <form onSubmit={handleSubmit}>
            <FormattedMessage id="form.email" defaultMessage="Email">
                {msg => (
                    <Field id="email" name="email" component={renderInput} label={msg}/>
                )}
            </FormattedMessage>
            <FormattedMessage id="form.password" defaultMessage="Password">
                {msg => (
                    <Field
                        id="password"
                        name="password"
                        type="password"
                        component={renderInput}
                        label={msg}
                    />
                )}
            </FormattedMessage>
            <button
                type="submit"
                className="btn btn-primary lat-login-submit"
                disabled={submitting}
            >
                Log in
            </button>
            <div className="form-group">
                <Link className="btn btn-primary btn-sm lat-links" to="resetpwd">
                    <FormattedMessage
                        id="form.forgotten.password"
                        defaultMessage="Forgotten your password?"
                    />
                </Link>
            </div>
            <div className="form-group">
                <Link className="btn btn-primary btn-sm lat-links" to="/signup">
                    sign up >
                </Link>
            </div>
            <div className="form-group">
                <Link className="btn btn-primary btn-sm lat-links" to="/onboard">
                    or Onboarding>
                </Link>
            </div>
            {/*<div className="form-group">*/}
                {/*<Link className="btn btn-primary btn-sm lat-links" to="/full-onboard">*/}
                    {/*or Full Onboard >*/}
                {/*</Link>*/}
            {/*</div>*/}
        </form>
    );
};

export default reduxForm({
    form: "login",
    validate: validators
})(LoginForm);
