import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';

import logout from '../../assets/icon-logout.svg';
import { showBarcode } from '../../constants';

import './index.css';

const onLogout = () => {
  window.localStorage.clear();
  window.location.href = '/';
};

const Header = props => {
  const { isPC, org_id } = props;
  const { pathname } = props.location;

  return (
    <nav>
      <Link className="logo" to="/" />
      <div className="menus">
        {isPC &&
          showBarcode(org_id) && (
            <Link
              className={classnames('menu', {
                'menu--selected': pathname === '/barcode'
              })}
              to="/barcode"
              replace
            >
              Barcode Scanner
            </Link>
          )}

        <Link
          className={classnames('menu', {
            'menu--selected': pathname === '/spotpay'
          })}
          to="/spotpay"
          replace
        >
          Spotpay
        </Link>

        <a
          href="/merchant"
          className={classnames('menu', {
            'menu--selected': pathname === '/merchant'
          })}
          target="_blank"
        >
          <span className="menu-long">Transaction Records</span>
          <span className="menu-short">Transactions</span>
        </a>
      </div>

      <div className="logout" onClick={onLogout}>
        <img src={logout} alt="logout" />
      </div>
    </nav>
  );
};

export default connect(({ data: { profile: { org_id } } }) => ({
  org_id
}))(Header);
