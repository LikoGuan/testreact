import React, { Component } from "react";
import { STATUS } from "../constants";
import Icons from "../icons";
import { moneyString, getDateTimeDisplay } from "../util";

class InvoiceDetail extends Component {
  render() {
    const {
      orderId,
      transactionId,
      amount,
      currency,
      userName,
      createTime,
      modifyTime,
      walletName,
      walletCode,
      customerName,
      reference,
      description,
      attachments,
      status
    } = this.props.invoice;

    return (
      <div>
        <div className="lat-table">
          <div className="table-responsive">
            <table className="table  table-hover ">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{orderId}</td>
                </tr>
                <tr>
                  <td>Order ID</td>
                  <td>{transactionId}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>{moneyString(amount, currency)}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>Invoice</td>
                </tr>
                <tr>
                  <td>Invoice status</td>
                  <td>{STATUS[status]}</td>
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
                  <td>Proccessed on</td>
                  <td>{getDateTimeDisplay(new Date(modifyTime))}</td>
                </tr>
                <tr>
                  <td>Created on</td>
                  <td>{getDateTimeDisplay(new Date(createTime))}</td>
                </tr>
                <tr>
                  <td>Created by</td>
                  <td>{userName}</td>
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
                    {walletName} ({walletCode})
                  </td>
                </tr>
                <tr>
                  <td>Customer name</td>
                  <td>{customerName}</td>
                </tr>
                <tr>
                  <td>Invoice description</td>
                  <td>{description}</td>
                </tr>
                <tr>
                  <td>Invoice reference</td>
                  <td>{reference}</td>
                </tr>
                <tr>
                  <td>Attachments</td>
                  <td>
                    {(attachments || []).map((att, i) => (
                      <div className="invoice-detail__link" key={i}>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {att.name}
                          &nbsp;
                          {Icons.file}
                        </a>
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default InvoiceDetail;
