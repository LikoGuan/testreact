import React from 'react';
import styled from 'styled-components';
import { SansText } from 'primitive-collections';
const Footer = styled.footer`
  font-size: 11px;
  text-align: right;

  height: 30px;
  margin-top: -30px;
  margin-right: 30px;
`;

export default () => (
  <Footer>
    <SansText>© 2017 Latitude Technologies Limited.</SansText>
  </Footer>
);
