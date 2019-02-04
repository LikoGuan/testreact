import React, { Component } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import Alert from "react-s-alert";

import api from "../../api";
import { getDateTimeDisplay } from "../../util";
import { CURRENCIES_CODE_SIGN } from "../../constants";

function capitalizeFirstLetter(string) {
  if (string === null || string === undefined) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class Detail extends Component {
  state = { order: {} };

  constructor(props) {
    super(props);
    this.state = {
      order: props.transaction
    };
  }

  async componentDidMount() {
    const { orderId } = this.props.transaction;
    const { data } = await api.transactions.id(orderId);
    this.setState({
      order: data.order || {}
    });

    const { refundAmount, payCurrency } = data.order || {};
    const value = numeral(refundAmount).value();
    if (value > 0) {
      this.props.updateMaxRefundAmount(value, payCurrency);
    }
  }

  shouldShowOrderID(type) {
    if (type) {
      const typeCode = type.toLowerCase();
      return typeCode === "online";
    }
    return false;
  }

  shouldShowReference(type) {
    if (type) {
      const typeCode = type.toLowerCase();
      return (
        typeCode === "spotpay" ||
        typeCode === "staticpay" ||
        typeCode === "withdrawals" ||
        typeCode === "invoice" ||
        typeCode === "refunds" ||
        typeCode === "transfer"
      );
    }
    return false;
  }

  shouldShowNonce(type) {
    if (type) {
      const typeCode = type.toLowerCase();
      return (
        typeCode === "refunds" ||
        typeCode === "transactionfee" ||
        typeCode === "rebate"
      );
    }
    return false;
  }

  redeem = async () => {
    const { order = {} } = this.state;
    const { orderId } = order;
    if (!orderId) return;

    const { data } = await api.coupons.redeem(orderId);
    if (data.code === 0) {
      Alert.success("Succeeded");

      this.setState({
        order: {
          ...order,
          preCouponUsed: true
        }
      });
    } else {
      Alert.warning("Failed to redeem");
    }
  };

  render() {
    const {
      showRefund,
      transaction: { orderId, amount, currency, userId }
    } = this.props;
    const {
      userName,
      walletName,
      accountCode,
      modifyTime,
      createTime,
      type,
      bankAccount,
      reference,
      nonce,
      productName,
      customerOrderId,
      refundAmount,
      status,
      rate,
      paymentMethod,
      inApp,
      preCouponOrderId,
      preCouponUsed,
      originalAmount,
      couponServiceFee,
      couponDiscountRate,
      couponDiscount
    } = this.state.order;

    const refundAmountValue = refundAmount ? numeral(refundAmount).value() : 0;
    const showRedeemBtn = preCouponOrderId && !preCouponUsed;

    const displayAmount = numeral(Math.abs(amount)).format("0,0.00");
    const sign = CURRENCIES_CODE_SIGN[currency];

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

    return (
      <div>
        <div className="lat-table">
          <div className="table-responsive">
            <table className="table  table-hover ">
              <tbody>
                <tr>
                  <td>Transaction ID</td>
                  <td>{orderId}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>
                    {`${
                      amount < 0 ? "-" : ""
                    }${sign}${displayAmount} ${currency}`}
                  </td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{type}</td>
                </tr>

                <tr>
                  <td>Payment Method</td>
                  <td>{method}</td>
                </tr>

                {originalAmount && (
                  <tr>
                    <td>Original Amount</td>
                    <td>${numeral(originalAmount).format("0,0.00")} NZD</td>
                  </tr>
                )}
                {couponDiscount && (
                  <tr>
                    <td>Discount</td>
                    <td>-${couponDiscount}</td>
                  </tr>
                )}
                {couponDiscountRate && (
                  <tr>
                    <td>Discount</td>
                    <td>
                      {numeral(couponDiscountRate)
                        .multiply(100)
                        .value()}
                      % off
                    </td>
                  </tr>
                )}

                {couponServiceFee && (
                  <tr>
                    <td>Redemption Fee</td>
                    <td>${numeral(couponServiceFee).format("0,0.00")} NZD</td>
                  </tr>
                )}

                {rate !== 0 && rate > 0 && (
                  <tr>
                    <td>Rate</td>
                    <td>{rate}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="page-header lat-page-header">
          <div className="lat-header-op" />
        </div>
        <div className="lat-table">
          <div className="table-responsive">
            <table className="table  table-hover ">
              <tbody>
                <tr>
                  <td>Proccessed on</td>
                  <td>{getDateTimeDisplay(new Date(modifyTime))}</td>
                </tr>
                <tr>
                  <td>Created on</td>
                  <td>{getDateTimeDisplay(new Date(createTime))}</td>
                </tr>
                <tr>
                  <td>Created By</td>
                  <td>
                    {userName} ({userId})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="page-header lat-page-header">
          <div className="lat-header-op" />
        </div>
        <div className="lat-table">
          <div className="table-responsive">
            <table className="table  table-hover ">
              <tbody>
                <tr>
                  <td>Wallet Name</td>
                  <td>
                    {walletName} ({accountCode})
                  </td>
                </tr>
                {type === "Withdrawals" && (
                  <tr>
                    <td>Bank account</td>
                    <td>{bankAccount}</td>
                  </tr>
                )}
                {this.shouldShowOrderID(type) && (
                  <tr>
                    <td>Order ID</td>
                    <td>{customerOrderId}</td>
                  </tr>
                )}
                {type === "Invoice" && (
                  <tr>
                    <td>Invoice ID</td>
                    <td>{customerOrderId}</td>
                  </tr>
                )}
                {this.shouldShowReference(type) && (
                  <tr>
                    <td>Reference</td>
                    <td>{reference}</td>
                  </tr>
                )}
                {this.shouldShowNonce(type) && (
                  <tr>
                    <td>Nonce</td>
                    <td>{nonce}</td>
                  </tr>
                )}
                {type === "Online" && (
                  <tr>
                    <td>Product name</td>
                    <td>{productName}</td>
                  </tr>
                )}
                {status && (
                  <tr>
                    <td>Status</td>
                    <td>{capitalizeFirstLetter(status)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="lat-table">
            {refundAmountValue > 0 && (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={showRefund}
                style={{ marginRight: 30 }}
              >
                Refund
              </button>
            )}

            {showRedeemBtn && (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.redeem}
              >
                Redeem
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Detail.propTypes = {
  transaction: PropTypes.object.isRequired,
  showRefund: PropTypes.func.isRequired
};

export default Detail;
