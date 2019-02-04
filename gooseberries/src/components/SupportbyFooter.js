import React from "react";
import styled from "styled-components";

import logo from "../assets/logo.svg";

// position: absolute;
//   bottom: 0;
//   left: 50%;
//   z-index: -1;
//   transform: translate(-50%, 0);
const Footer = styled.div`
  text-align: center;
  font-size: 0.7em;
  width: 100%;
  height: 40px;
  color: #888888;
  margin-top: -40px;
`;

const _Logo = props => <img src={logo} alt="latipay" {...props} />;
const Logo = styled(_Logo)`
  vertical-align: middle;
  padding-left: 10px;
  height: 50%;
  opacity: 0.8;
  color: #888888;
`;

export default ({ child, className }) => (
  <Footer className={className}>
    <span>Powered by</span>
    <Logo />
    {child}
  </Footer>
);
