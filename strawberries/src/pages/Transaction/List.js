import React, { Component } from "react";
import { connect } from "react-redux";

import { Pagination } from "react-bootstrap";
import { DateUtils } from "react-day-picker";
import Alert from "react-s-alert";
import numeral from "numeral";
import "react-day-picker/lib/style.css";

import api from "../../api";
import Modal from "../../modals";
import Detail from "./Detail";
import Refund from "../../forms/Refund";
import MultiSelect from "../../components/MultiSelect";
import DateSelect from "../../components/DateSelect";
import { debounce } from "../../util";
import { TRANSCATION_TYPES, CURRENCIES_CODE_SIGN } from "../../constants";
import { getDate, getDateDisplay } from "../../components/TransactionsList";
import { actions as walletsActions } from "../../redux/ducks/wallets";

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detailModal: false,
      refundModal: false,
      transactions: [],
      selectedTransaction: {},
      page: 1,
      size: 20,
      total: 0,
      from: null,
      to: null,
      type: {}
    };

    this.goTo = this.goTo.bind(this);
    this.onHideDetail = this.onHideDetail.bind(this);
    this.onHideRefund = this.onHideRefund.bind(this);

    this.onRefundSubmit = this.onRefundSubmit.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.renderTransaction = this.renderTransaction.bind(this);
    this.readInfo = this.readInfo.bind(this);
  }

  componentDidMount() {
    this.getTransactions();
  }

  componentWillReceiveProps() {
    //when wallets of state changing, this method will be called
    this.resetFilter();
    this._search();
  }

  async getTransactions() {
    const {
      size: pageSize,
      page: pageNo,
      from: startTime,
      to: endTime,
      type
    } = this.state;

    const { couponUsed } = this.props;

    const { data } = await api.transactions.list({
      pageSize,
      pageNo,
      startTime: getDate(startTime),
      endTime: getDate(endTime),
      type: Object.keys(type)
        .filter(key => type[key])
        .join(","),
      status: this.props.status,
      fuzzyString: this.props.fuzzyString,
      couponUsed
    });

    if (data.code === 0) {
      this.setState({
        transactions: data.page.result,
        page: data.page.currentPageNo,
        total: data.page.totalNum
      });
    }
  }

  showDetail = (transaction, callback) => () =>
    this.setState(
      {
        selectedTransaction: transaction,
        detailModal: true,
        refundModal: false,
        maxRefundAmount: null
      },
      callback
    );

  showRefund = () => {
    this.setState({
      detailModal: false,
      refundModal: true
    });
  };

  onHideDetail() {
    this.setState({
      detailModal: false
    });
  }

  onHideRefund() {
    this.setState({
      refundModal: false,
      maxRefundAmount: null
    });
  }

  async onRefundSubmit(form) {
    const { data } = await api.refunds.update({
      ...form,
      orderId: this.state.selectedTransaction.orderId
    });

    if (!data.code && !data.error) {
      Alert.success("Succeeded");
      this.showDetail(
        this.state.selectedTransaction,
        this.props.fetchWallets
      )();
    } else {
      Alert.warning(`Failed to refund: ${data.message}`);
    }
  }

  renderTransaction(transaction) {
    const { walletsMap = {} } = this.props;
    const {
      createTime,
      orderId,
      amount,
      type,
      currency,
      accountCode,
      status,
      paymentMethod,
      inApp
    } = transaction;
    const displayAmount = numeral(Math.abs(amount)).format("0,0.00");

    const methods = {
      dd: "DD",
      latipay: "Wallet balance",
      polipay: "Polipay",
      alipay: "Alipay",
      wechat: "Wechat",
      none: " "
    };
    let method = methods[paymentMethod] || paymentMethod;
    if (inApp) {
      if (paymentMethod === "alipay") {
        method = "In-app Alipay";
      } else if (paymentMethod === "wechat") {
        method = "In-app Wechat";
      }
    }

    const sign = CURRENCIES_CODE_SIGN[currency];

    return (
      <tr
        key={orderId}
        onClick={this.showDetail(transaction)}
        className={type.toLowerCase()}
      >
        <td>{getDateDisplay(new Date(createTime))}</td>
        <td>{type}</td>
        <td className="hidden-xs">{method}</td>
        <td className="hidden-xs">{orderId}</td>
        <td className="hidden-xs">
          {(walletsMap[accountCode] || {}).name || ""}
        </td>
        <td>
          <span
            style={
              status === "canceled" ? { textDecoration: "line-through" } : {}
            }
          >{`${
            amount < 0 ? "-" : ""
          }${sign}${displayAmount} ${currency}`}</span>

          {status === "canceled" && <span> Canceled</span>}
        </td>
      </tr>
    );
  }

  goTo(page) {
    this.setState(
      {
        page
      },
      this.getTransactions
    );
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState({ ...range, page: 1 }, this.getTransactions);
  }

  handleTypeChange(option) {
    const type = {
      ...this.state.type,
      ...{
        [option]: !this.state.type[option]
      }
    };

    this.setState(
      {
        type,
        page: 1
      },
      this.getTransactions
    );
  }

  _search = debounce(this.getTransactions, 1000);

  resetDatePicker = () => {
    this.setState({ from: null, to: null }, this.getTransactions);
  };

  resetFilter = () => {
    this.setState({
      page: 1,
      from: null,
      to: null,
      type: {}
      //TODO total should set to 0
    });
  };

  toggleTable = () => {
    this.setState({
      show: !this.state.show
    });
  };

  readInfo() {
    const { type, from, to } = this.state;
    return { type, from, to };
  }

  updateMaxRefundAmount = (maxRefundAmount, payCurrency) => {
    this.setState({
      maxRefundAmount,
      payCurrency
    });
  };

  render() {
    const { couponUsed } = this.props;
    const { from, to, maxRefundAmount, payCurrency } = this.state;

    return (
      <div>
        <table className="table table-hover ">
          <thead>
            <tr>
              <th>
                {!couponUsed && (
                  <DateSelect
                    {...{
                      from,
                      to,
                      resetDatePicker: this.resetDatePicker,
                      handleDayClick: this.handleDayClick
                    }}
                  />
                )}

                {couponUsed && (
                  <div className="btn btn-default btn-nullify">Date</div>
                )}
              </th>
              <th>
                {!couponUsed && (
                  <MultiSelect
                    title="type"
                    values={this.state.type}
                    options={TRANSCATION_TYPES}
                    onChange={this.handleTypeChange || (() => {})}
                  />
                )}

                {couponUsed && (
                  <div className="btn btn-default btn-nullify">Type</div>
                )}
              </th>
              <th className="hidden-xs">
                <div className="btn btn-default btn-nullify">
                  Payment Method
                </div>
              </th>
              <th className="hidden-xs">
                <div className="btn btn-default btn-nullify">
                  Transaction ID
                </div>
              </th>
              <th className="hidden-xs">
                <div className="btn btn-default btn-nullify">Wallet Name</div>
              </th>
              <th>
                <div className="btn btn-default btn-nullify">Amount</div>
              </th>
            </tr>
          </thead>
          <tbody>{this.state.transactions.map(this.renderTransaction)}</tbody>
        </table>
        <div className="lat-footer-op">
          <Pagination
            bsSize="small"
            items={Math.ceil(this.state.total / this.state.size)}
            maxButtons={5}
            activePage={this.state.page}
            onSelect={this.goTo}
          />
        </div>

        <Modal
          show={this.state.detailModal}
          onHide={this.onHideDetail}
          title="Transaction Details"
        >
          <Detail
            transaction={this.state.selectedTransaction}
            showRefund={this.showRefund}
            updateMaxRefundAmount={this.updateMaxRefundAmount}
          />
        </Modal>
        <Modal
          show={this.state.refundModal}
          onHide={this.onHideRefund}
          title="Refund"
        >
          <Refund
            onSubmit={this.onRefundSubmit}
            orderId={this.state.selectedTransaction.orderId}
            payCurrency={payCurrency}
            maxRefundAmount={maxRefundAmount}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(
  ({ wallets }) => {
    const arr = wallets.data || [];

    const map = {};
    arr.forEach(item => {
      map[item.accountCode] = {
        name: item.accountName,
        currencyString: item.currencyString
      };
    });

    return {
      walletsMap: map
    };
  },
  walletsActions,
  null,
  { withRef: true }
)(List);
