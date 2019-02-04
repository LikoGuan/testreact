import React from "react";
import PropTypes from "prop-types";

import Icons from "../icons";

const IconButton = ({
  onClick,
  children,
  icon = "add",
  type = "success",
  className = "",
  ...props
}) => (
  <a className={`btn btn-${type} btn-sm ${className}`} onClick={onClick}>
    {children}
    <div className="button-icon">{Icons[icon]}</div>
  </a>
);

IconButton.propTypes = {
  onClick: PropTypes.func
};

export default IconButton;
