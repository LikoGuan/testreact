import React, { Component } from "react";
import { connect } from "react-redux";
import { hasParameter } from "../util";

import Wallets from "./Wallets";
import Transation from "./Transaction";

export class Summary extends Component {
  render() {
    const { userName } = this.props;

    const hideWallet = hasParameter(this.props, "show", "transaction");
    const hideTransaction = hasParameter(this.props, "show", "wallet");

    return (
      <div className="lat-content">
        {!hideWallet && (
          <div>
            {hideTransaction && <h1 className="lat-greeting">Wallets</h1>}
            {!hideTransaction && (
              <h1 className="lat-greeting">Hi, {userName}</h1>
            )}

            <Wallets />
          </div>
        )}
        {!hideTransaction && <Transation />}
      </div>
    );
  }
}

export default connect(({ me: { userName } }) => ({ userName }))(Summary);
