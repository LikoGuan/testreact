import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../layout/Logo';
// import searchIcon from './assets/ic_search.svg';

const Header = props => (
  <div className="sp-header">
    <div className="sp-nav">
      <Logo to="/" />
      <span className="sp-support">Support</span>
      <nav className="floatright">
        <NavLink
          className="sp-xs-hidden"
          activeClassName="selected"
          to="/support"
          exact
        >
          Self Training
        </NavLink>

        <a className="sp-xs-hidden" href="https://doc.latipay.net/v2/">
          API DOCUMENTATION
        </a>

        <NavLink className="sp-btn--fillgreen" to="/login" exact>
          Log In
        </NavLink>
      </nav>
    </div>

    {/* <div className="sp-search">
      <input
        placeholder="What can we help you? Search for a topic or question…"
        onChange={props.search}
      />
      <img src={searchIcon} alt="" />
    </div> */}
  </div>
);

export default Header;
