import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        // check if jwt token is presented
        auth.jwt
          ? <Component {...props} />
          : <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />}
    />
  );
};
export default connect(state => state)(PrivateRoute);
