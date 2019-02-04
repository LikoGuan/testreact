import React from 'react';
import styled from 'styled-components';

import logo from '../assets/logo.svg';

// position: absolute;
//   bottom: 0;
//   left: 50%;
//   z-index: -1;
//   transform: translate(-50%, 0);
const Footer = styled.div`
  text-align: center;
  font-size: 0.9em;
  width: 100%;
  color: #888888;
`;

const _Logo = props => <img src={logo} alt="latipay" {...props} />;
const Logo = styled(_Logo)`
  vertical-align: middle;
  padding-left: 10px;
  height: 50%;
  opacity: 0.8;
  color: #888888;
`;

export default ads => ({ child, className }) => {
  return (
    <Footer className={className}>
      <div className="confirm-footer-anz-text">
        <span>Supported by</span>
        <Logo />
      </div>
      <a className="confirm-footer-anz" href={ads.href ? ads.href : '#'}>
        <img src={ads.src} alt={ads.title} />
      </a>
    </Footer>
  );
};
