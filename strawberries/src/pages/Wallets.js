import React, { Component } from "react";
import { connect } from "react-redux";
import CurrencyWallets from "./CurrencyWallets";

import { actions as walletsActions } from "../redux/ducks/wallets";
import { CURRENCIES } from "../constants";

export class Wallets extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      wdmodal: false,
      wallets: []
    };
  }
  componentDidMount() {
    this.props.fetchWallets();
  }

  render() {
    const { currencyWallets = {}, ...props } = this.props;

    return (
      <div>
        {Object.keys(currencyWallets).map(currencyString => {
          const currencyWallet = currencyWallets[currencyString];
          const closeCurrency = Object.keys(CURRENCIES).reduce(
            (res, currency) => {
              if (CURRENCIES[currency].code === currencyString) {
                res = currency;
              }
              return res;
            },
            ""
          );

          return (
            currencyWallet.wallets.length && (
              <CurrencyWallets
                {...props}
                key={currencyString}
                currency={currencyWallet.currency}
                closeCurrency={closeCurrency}
                currencyString={currencyString}
                total={currencyWallet.total}
                wallets={currencyWallet.wallets}
              />
            )
          );
        })}
      </div>
    );
  }
}

const aggregateWalletsData = data =>
  data.reduce((group, wallet) => {
    if (wallet.currencyString) {
      if (!group[wallet.currencyString]) {
        group[wallet.currencyString] = {
          wallets: [],
          total: 0,
          currency: wallet.currency
        };
      }
      const currencyWallet = group[wallet.currencyString];
      currencyWallet.wallets.push(wallet);
      currencyWallet.total += wallet.amount;
    }
    return group;
  }, {});

export default connect(
  ({ wallets }) => ({
    currencyWallets: aggregateWalletsData(wallets.data)
  }),
  walletsActions
)(Wallets);
