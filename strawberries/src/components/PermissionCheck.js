import React from 'react';
import { connect } from 'react-redux';

export const PermissionCheck = ({ children, permission, me }) => {
  if (me.permissions[permission]) {
    return React.Children.only(children);
  } else return null;
};
export default connect(state => state)(PermissionCheck);
