import React, { Component } from "react";

import IconButton from "../../components/IconButton";

import List from "./List";

class CouponTransactions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  toggleTable = () => {
    this.setState({
      show: !this.state.show
    });
  };

  render() {
    const { show } = this.state;
    const icon = show ? "arrowup" : "arrowdown";
    const tableClass = show ? "lat-toggle-show" : "lat-toggle-hide";

    return (
      <div className="lat-content" id="lat-page-history">
        <div className="page-header lat-page-header lat-history-header">
          <p>Coupon List</p>
          <div className="lat-header-op">
            <IconButton icon={icon} type="primary" onClick={this.toggleTable}>
              {show ? "HIDE" : "SHOW"}
            </IconButton>
          </div>
        </div>
        <div className={`lat-table lat-placeholder ${tableClass}`}>
          <List
            couponUsed={1}
            ref={table => {
              this.table = table;
            }}
          />
        </div>
      </div>
    );
  }
}

export default CouponTransactions;
