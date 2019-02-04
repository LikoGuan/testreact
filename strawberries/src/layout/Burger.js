import React, { Component } from 'react';
import Logo from './Logo';
import Nav from './Nav';

import classNames from 'classnames';
class Burger extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }
  
  open() {
    this.setState({ open: true });
  }
  close() {
    this.setState({ open: false });
  }
  render() {
    return (
      <div>
        <div className={classNames('lat-burger-menu-offcanvas', { open: this.state.open })}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <a className="lat-burger-close" onClick={this.close}>Close X</a>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-11 col-xs-offset-1">
                <Logo to="/wallets" />
              </div>
            </div>
            <div className="row" onClick={this.close}>
              <div className="col-xs-11 col-xs-offset-1">
                <Nav />
              </div>
            </div>
          </div>
        </div>
        <a className="lat-burger-menu" onClick={this.open}>
          <div className="lat-burger">
            <div />
            <div />
            <div />
          </div>
          Menu
        </a>
      </div>
    );
  }
}
export default Burger;
