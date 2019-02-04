import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import api from "../../api";
import IconButton from "../../components/IconButton";
import SearchInput from "../../components/SearchInput";

import { download } from "../../util";
import { getDate } from "../../components/TransactionsList";
import List from "./List";
import { actions as walletsActions } from "../../redux/ducks/wallets";

const _STATUS = "success,canceled";

class History extends Component {
  constructor(props) {
    super(props);

    this.exportTransactions = this.exportTransactions.bind(this);
  }

  async exportTransactions(e) {
    e.preventDefault();

    const { type, from, to } = this.table.getWrappedInstance().readInfo();

    const a = Object.keys(type);
    const b = a.filter(key => type[key]);
    const typeValue = b.join(",");

    const { data } = await api.transactions.export({
      fuzzyString: this.props.fuzzyString,
      startTime: getDate(from),
      endTime: getDate(to),
      status: "success",
      type: typeValue
    });
    if (!data.code) {
      download("latipay-transations-export.csv", data);
    }
  }

  searchChanged = value => {
    this.props.walletsToHistory(value);
  };

  render() {
    return (
      <div className="lat-content" id="lat-page-history">
        <div className="page-header lat-page-header lat-history-header">
          <p>History</p>
          <div className="lat-header-op">
            <SearchInput
              fuzzy={this.props.fuzzyString}
              onChange={this.searchChanged}
            />
            <IconButton
              icon="file"
              type="primary"
              onClick={this.exportTransactions}
              className="hidden-xs"
            >
              Export
            </IconButton>
          </div>
        </div>
        <div className="lat-table lat-placeholder">
          <List
            status={_STATUS}
            fuzzyString={this.props.fuzzyString}
            ref={table => {
              this.table = table;
            }}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({ fuzzyString: state.wallets.fuzzyString }),
  walletsActions
)(History);

History.propTypes = {
  fuzzyString: PropTypes.string.isRequired,
  walletsToHistory: PropTypes.func.isRequired
};
