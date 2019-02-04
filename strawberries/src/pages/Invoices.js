import React, { Component } from "react";
import { connect } from "react-redux";
import { Pagination, Dropdown, MenuItem } from "react-bootstrap";
import { DateUtils } from "react-day-picker";
import Alert from "react-s-alert";
import clipboard from "clipboard-polyfill";

import api from "../api";
import Modal, { FullScreen } from "../modals";
import IconButton from "../components/IconButton";
import InvoiceForm from "../forms/Invoice";
import { actions as ossActions } from "../redux/ducks/oss";
import {
  debounce,
  moneyString,
  moneyStringWithCode,
  getDateDisplay
} from "../util";
import SearchInput from "../components/SearchInput";
import DateSelect from "../components/DateSelect";
import { EditToggle } from "../components/DropdownToggle";
import InvoiceDetail from "../components/InvoiceDetail";
import { STATUS, INVOICE_STATUS_TEXT } from "../constants";
import icons from "../icons";
import MultiSelect from "../components/MultiSelect";

const getDate = date => {
  if (date) {
    return date.toISOString().substring(0, 10);
  } else return "";
};
class Invoices extends Component {
  constructor() {
    super();
    this.state = {
      drafts: [],
      invoices: [],
      invoice: {},
      modal_invoice: false,
      modal_sharelink: false,
      modal_sent: false,
      modal_detail: false,
      show_draft: true,
      showClipboard: false,
      needReload: false,
      draftQueries: {
        page: 1,
        size: 10,
        from: null,
        to: null,
        fuzzyString: ""
      },
      invoiceQueries: {
        page: 1,
        size: 10,
        from: null,
        to: null,
        fuzzyString: ""
      },

      invoiceStatus: {},
      draftWalletCode: {},
      sentWalletCode: {}
    };
  }
  componentDidMount() {
    this.getDrafts();
    this.getInvoices();
  }

  async getDrafts(targetId, callback) {
    const { size, page, fuzzyString, from, to } = this.state.draftQueries;

    const { wallets = [] } = this.props;
    const nameCodeMap = {};
    wallets.forEach(item => {
      nameCodeMap[item.accountName] = item.accountCode;
    });
    const ids = Object.keys(this.state.draftWalletCode)
      .filter(key => this.state.draftWalletCode[key])
      .map(name => nameCodeMap[name]);

    const para = {
      pageSize: size,
      pageNo: page,
      fuzzyString: fuzzyString,
      startTime: getDate(from),
      endTime: getDate(to)
    };

    if (ids.length > 0) {
      para.walletIds = ids.join(",");
    }
    const { data } = await api.drafts.list(para);
    if (data.code === 0) {
      this.setState(
        {
          drafts: data.page.result,
          draftQueries: {
            ...this.state.draftQueries,
            page: data.page.currentPageNo,
            total: data.page.totalNum
          }
        },
        targetId && callback
          ? () => {
              const newInvoice = this.state.drafts.find(
                item => item.id === targetId
              );
              if (newInvoice) callback(newInvoice);
            }
          : undefined
      );
    }
  }
  async getInvoices() {
    const { size, page, fuzzyString, from, to } = this.state.invoiceQueries;

    const para = {
      pageSize: size,
      pageNo: page,
      fuzzyString: fuzzyString,
      startTime: getDate(from),
      endTime: getDate(to)
    };

    //wallet
    const { wallets = [] } = this.props;
    const nameCodeMap = {};
    wallets.forEach(item => {
      nameCodeMap[item.accountName] = item.accountCode;
    });
    const walletIds = Object.keys(this.state.sentWalletCode)
      .filter(key => this.state.sentWalletCode[key])
      .map(name => nameCodeMap[name]);

    if (walletIds.length > 0) {
      para.walletIds = walletIds.join(",");
    }

    //status
    const statusesText = Object.keys(this.state.invoiceStatus).filter(
      key => this.state.invoiceStatus[key]
    );
    if (statusesText.length > 0) {
      const textMap = {};
      Object.keys(STATUS).forEach(item => {
        textMap[STATUS[item]] = item;
      });
      const arr = statusesText.map(item => textMap[item]);
      para.statuses = arr.join(",");
    }

    const { data } = await api.invoices.list(para);
    if (data.code === 0) {
      this.setState({
        invoices: data.page.result,
        invoiceQueries: {
          ...this.state.invoiceQueries,
          page: data.page.currentPageNo,
          total: data.page.totalNum
        }
      });
    }
  }
  draftGoto = page => {
    this.setState(
      {
        draftQueries: {
          ...this.state.draftQueries,
          page
        }
      },
      this.getDrafts
    );
  };
  invoiceGoto = page => {
    this.setState(
      {
        invoiceQueries: {
          ...this.state.invoiceQueries,
          page
        }
      },
      this.getInvoices
    );
  };
  handleDayClickDraft = day => {
    const range = DateUtils.addDayToRange(day, this.state.draftQueries);
    this.setState(
      {
        draftQueries: {
          ...this.state.draftQueries,
          ...range,
          page: 1
        }
      },
      this.getDrafts
    );
  };
  resetDatePickerDraft = () => {
    this.setState(
      {
        draftQueries: {
          ...this.state.draftQueries,
          from: null,
          to: null,
          page: 1
        }
      },
      this.getDrafts
    );
  };

  handleDayClickInvoice = day => {
    const range = DateUtils.addDayToRange(day, this.state.invoiceQueries);
    this.setState(
      {
        invoiceQueries: {
          ...this.state.invoiceQueries,
          ...range,
          page: 1
        }
      },
      this.getInvoices
    );
  };
  resetDatePickerInvoice = () => {
    this.setState(
      {
        invoiceQueries: {
          ...this.state.invoiceQueries,
          from: null,
          to: null,
          page: 1
        }
      },
      this.getInvoices
    );
  };

  _searchDraft = debounce(this.getDrafts, 1000);
  _searchInvoice = debounce(this.getInvoices, 1000);

  searchDraft = value => {
    this.setState(
      {
        draftQueries: {
          ...this.state.draftQueries,
          fuzzyString: value,
          page: 1,
          from: null,
          to: null
        }
      },
      this._searchDraft
    );
  };
  searchInvoice = value => {
    this.setState(
      {
        invoiceQueries: {
          ...this.state.invoiceQueries,
          fuzzyString: value,
          page: 1,
          from: null,
          to: null
        }
      },
      this._searchInvoice
    );
  };

  onAddInvoice = () => {
    this.form = {};
    this.props.fetchOSS();
    this.setState({ modal_invoice: true });
  };
  onEditDraft(invoice) {
    this.form = invoice;
    this.props.fetchOSS();
    this.setState({ modal_invoice: true });
  }
  onDeleteDraft = async invoice => {
    const { data } = await api.drafts.delete(invoice.id);
    if (data.code === 0) {
      Alert.success("Succeeded");
      this.getDrafts();
    } else {
      Alert.warning("Failed to delete");
    }
  };
  onResendInvoice = async invoice => {
    if (this.isMenuDisabled(invoice)) return;

    const { data } = await api.invoices.resend(invoice.orderId);
    if (data.code === 0) {
      Alert.success("Succeeded");
    } else {
      Alert.warning("Failed to resend");
    }
  };
  isMenuDisabled(invoice) {
    const lower = STATUS[invoice.status].toLowerCase();
    return lower === "paid" || lower === "success";
  }
  onDupInvoice = async (invoice, idName, isDraft) => {
    const duplicateApi = isDraft
      ? api.drafts.duplicate
      : api.invoices.duplicate;
    const { data } = await duplicateApi(invoice[idName]);

    if (data.code === 0) {
      Alert.success("Succeeded");

      const id = data.id;
      if (id) {
        this.getDrafts(id, invoice => {
          this.onEditDraft(invoice);
        });
      } else {
        this.getDrafts();
      }
    } else {
      Alert.warning("Failed to duplicate");
    }
  };
  onShareLink = async invoice => {
    if (this.isMenuDisabled(invoice)) return;

    const { data } = await api.invoices.share(invoice.orderId);
    if (data.code === 0) {
      this.setState({
        modal_sharelink: true,
        sharedLink: data.sharedLink
      });
    } else {
      Alert.warning("Failed to share");
    }
  };
  showDetail = invoice => {
    this.setState({ modal_detail: true, invoiceDetail: invoice });
  };
  onHide = () => {
    const reload = () => {
      this.getInvoices();
      this.setState({
        needReload: false
      });
    };

    this.setState(
      {
        modal_invoice: false,
        modal_sharelink: false,
        modal_sent: false,
        modal_detail: false
      },
      this.state.needReload && reload
    );
  };
  onSubmit = async form => {
    let res;
    if (form.sendnow) {
      res = await api.invoices.send(form);
      if (res.data.code === 0) {
        this.setState({
          invoiceSent: {
            ...form,
            id: res.data.id,
            sharedLink: res.data.sharedLink
          },
          modal_sent: true
        });
      }
    } else {
      res = await (form.id ? api.drafts.update(form) : api.drafts.create(form));
    }

    if (res.data.code === 0) {
      this.setState({
        modal_invoice: false
      });
      this.getDrafts();
      this.getInvoices();
    } else {
      Alert.warning(res.data.message || "Errored, Please try it later.");
    }
  };

  handleInvoiceStatusChange = option => {
    const invoiceStatus = {
      ...this.state.invoiceStatus,
      [option]: !this.state.invoiceStatus[option]
    };
    this.setState(
      {
        invoiceStatus,
        page: 1
      },
      this.getInvoices
    );
  };

  handleDraftWalletChange = option => {
    const draftWalletCode = {
      ...this.state.draftWalletCode,
      [option]: !this.state.draftWalletCode[option]
    };
    this.setState(
      {
        draftWalletCode,
        page: 1
      },
      this.getDrafts
    );
  };

  handleSentWalletChange = option => {
    const sentWalletCode = {
      ...this.state.sentWalletCode,
      [option]: !this.state.sentWalletCode[option]
    };
    this.setState(
      {
        sentWalletCode,
        page: 1
      },
      this.getInvoices
    );
  };

  renderDraft = invoice => {
    const {
      id,
      modifyTime,
      walletName,
      walletCode,
      customerName,
      amount,
      currency
    } = invoice;

    const walletIsDisabled = this.props.walletDisabledMap[walletCode] === 1;

    return (
      <tr key={id}>
        <td className="hidden-xs">{id}</td>
        <td className="hidden-xs">{getDateDisplay(new Date(modifyTime))}</td>
        <td className="hidden-xs">{walletName}</td>
        <td>{customerName}</td>
        <td>{moneyString(amount, currency)}</td>
        <td>
          <Dropdown pullRight id={`dropdown-draft-${id}`}>
            <EditToggle icon={icons.walletActions} bsRole="toggle" />
            <Dropdown.Menu>
              <MenuItem>
                <div onClick={() => this.onEditDraft(invoice)}>Edit</div>
              </MenuItem>
              <MenuItem disabled={walletIsDisabled}>
                <div onClick={() => this.onDupInvoice(invoice, "id", true)}>
                  Duplicate
                </div>
              </MenuItem>
              <MenuItem>
                <div onClick={() => this.onDeleteDraft(invoice)}>Delete</div>
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };
  renderInvoice = invoice => {
    const {
      orderId,
      modifyTime,
      walletName,
      walletCode,
      customerName,
      amount,
      status,
      currency,
      contactEmail
    } = invoice;

    const statusString = STATUS[status];
    const disableMenu = this.isMenuDisabled(invoice);
    const disableEmail = disableMenu || !contactEmail;

    const walletIsDisabled = this.props.walletDisabledMap[walletCode] === 1;

    return (
      <tr key={orderId} onClick={() => this.showDetail(invoice)}>
        <td className="hidden-xs">{orderId}</td>
        <td className="hidden-xs">{getDateDisplay(new Date(modifyTime))}</td>
        <td className="hidden-xs">{walletName}</td>
        <td>{customerName}</td>
        <td>{moneyString(amount, currency)}</td>
        <td className="hidden-xs">{statusString}</td>
        <td>
          <Dropdown
            pullRight
            id={`dropdown-invoice-${orderId}`}
            onClick={e => {
              e.stopPropagation();
              return false;
            }}
          >
            <EditToggle icon={icons.walletActions} bsRole="toggle" />
            <Dropdown.Menu>
              <MenuItem disabled={walletIsDisabled || disableEmail}>
                <div
                  onClick={
                    !disableEmail && (() => this.onResendInvoice(invoice))
                  }
                >
                  Resend email
                </div>
              </MenuItem>

              <MenuItem disabled={walletIsDisabled}>
                <div onClick={() => this.onDupInvoice(invoice, "orderId")}>
                  Duplicate
                </div>
              </MenuItem>

              <MenuItem disabled={walletIsDisabled || disableMenu}>
                <div
                  onClick={!disableMenu && (() => this.onShareLink(invoice))}
                >
                  Share link
                </div>
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };
  showClipboard = e => {
    e.preventDefault();

    clipboard.writeText(this.state.invoiceSent.sharedLink);
    Alert.success("Copied");

    this.setState({
      showClipboard: true,
      needReload: true
    });
  };

  hideClipboard = e => {
    e.preventDefault();

    this.setState({
      showClipboard: false
    });
  };
  openInvoiceLink = e => {
    e.preventDefault();

    window.open(this.state.invoiceSent.sharedLink, "_blank");

    this.setState({
      needReload: true
    });
  };
  render() {
    const {
      invoices,
      drafts,
      draftQueries,
      invoiceQueries,
      show_draft,
      invoiceSent,
      invoiceDetail,
      showClipboard
    } = this.state;
    const { wallets = [] } = this.props;

    const walletNames = wallets.map(item => item.accountName);
    return (
      <div className="lat-content">
        <h1 className="lat-greeting">Invoices</h1>
        <button
          className="btn btn-success btn-create-invoice"
          onClick={this.onAddInvoice}
        >
          Create Invoice
        </button>
        <div className="lat-content" id="lat-page-history">
          <div className="page-header lat-page-header lat-history-header">
            <p>Draft invoices </p>
            <div className="lat-header-op">
              <SearchInput
                onChange={this.searchDraft}
                fuzzy={draftQueries.fuzzyString}
                placeholder="WALLET/INVOICE ID"
              />
              <IconButton
                icon={show_draft ? "arrowup" : "arrowdown"}
                type="primary"
                onClick={() => {
                  this.setState({
                    show_draft: !this.state.show_draft
                  });
                }}
              >
                {show_draft ? "HIDE" : "SHOW"}
              </IconButton>
            </div>
          </div>
          <div
            className="lat-table lat-placeholder"
            style={{ display: show_draft ? "block" : "none" }}
          >
            <table className="table table-hover ">
              <thead>
                <tr>
                  <th className="hidden-xs">
                    <div className="btn btn-default btn-nullify"> ID</div>
                  </th>
                  <th className="hidden-xs">
                    <DateSelect
                      {...{
                        from: draftQueries.from,
                        to: draftQueries.to,
                        resetDatePicker: this.resetDatePickerDraft,
                        handleDayClick: this.handleDayClickDraft
                      }}
                    />
                  </th>

                  <th className="hidden-xs">
                    {this.props.wallets ? (
                      <MultiSelect
                        title="Wallet"
                        values={this.state.draftWalletCode}
                        options={walletNames}
                        onChange={this.handleDraftWalletChange}
                      />
                    ) : (
                      <div className="btn btn-default btn-nullify">Wallet</div>
                    )}
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">Recipient</div>
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">Amount</div>
                  </th>

                  <th>
                    <div className="btn btn-default btn-nullify">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>{drafts.map(this.renderDraft)}</tbody>
            </table>
            <div className="lat-footer-op">
              <Pagination
                bsSize="small"
                items={Math.ceil(draftQueries.total / draftQueries.size)}
                maxButtons={5}
                activePage={draftQueries.page}
                onSelect={this.draftGoto}
              />
            </div>
          </div>
        </div>

        <div className="lat-content">
          <div className="page-header lat-page-header lat-history-header">
            <p>Sent invoices </p>
            <div className="lat-header-op">
              <SearchInput
                onChange={this.searchInvoice}
                fuzzy={invoiceQueries.fuzzyString}
                placeholder="WALLET/INVOICE ID"
              />
            </div>
          </div>
          <div className="lat-table lat-placeholder">
            <table className="table table-hover ">
              <thead>
                <tr>
                  <th className="hidden-xs">
                    <div className="btn btn-default btn-nullify"> ID</div>
                  </th>
                  <th className="hidden-xs">
                    <DateSelect
                      {...{
                        from: invoiceQueries.from,
                        to: invoiceQueries.to,
                        resetDatePicker: this.resetDatePickerInvoice,
                        handleDayClick: this.handleDayClickInvoice
                      }}
                    />
                  </th>

                  <th className="hidden-xs">
                    {this.props.wallets ? (
                      <MultiSelect
                        title="Wallet"
                        values={this.state.sentWalletCode}
                        options={walletNames}
                        onChange={this.handleSentWalletChange}
                      />
                    ) : (
                      <div className="btn btn-default btn-nullify">Wallet</div>
                    )}
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">Recipient</div>
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">Amount</div>
                  </th>
                  <th className="hidden-xs">
                    {/*<div className="btn btn-default btn-nullify">Status</div>*/}
                    <MultiSelect
                      title="Status"
                      values={this.state.invoiceStatus}
                      options={INVOICE_STATUS_TEXT}
                      onChange={this.handleInvoiceStatusChange}
                    />
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">
                      <span>Action</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>{invoices.map(this.renderInvoice)}</tbody>
            </table>
            <div className="lat-footer-op">
              <Pagination
                bsSize="small"
                items={Math.ceil(invoiceQueries.total / invoiceQueries.size)}
                maxButtons={5}
                activePage={invoiceQueries.page}
                onSelect={this.invoiceGoto}
              />
            </div>
          </div>
        </div>
        <Modal
          show={this.state.modal_invoice}
          onHide={this.onHide}
          title={this.form && this.form.id ? "Edit invoice" : "Create invoice"}
        >
          <InvoiceForm onSubmit={this.onSubmit} initialValues={this.form} />
        </Modal>
        <Modal
          show={this.state.modal_detail}
          onHide={this.onHide}
          title="Invoice details"
        >
          {this.state.modal_detail && <InvoiceDetail invoice={invoiceDetail} />}
        </Modal>
        <Modal
          show={this.state.modal_sharelink}
          onHide={this.onHide}
          title="Share link"
        >
          <p>{this.state.sharedLink}</p>
          <button
            className="btn btn-primary "
            style={{ float: "right" }}
            onClick={() => {
              clipboard.writeText(this.state.sharedLink);
              Alert.success("Copied");
              this.onHide();
            }}
          >
            Copy
          </button>
        </Modal>

        <FullScreen show={this.state.modal_sent} onHide={this.onHide}>
          {this.state.modal_sent && (
            <div className="invoice-sent">
              <h2>Your invoice had been sent.</h2>
              <p>You had sent an invoice {invoiceSent.id}</p>
              <p>
                for
                {" " +
                  moneyStringWithCode(
                    invoiceSent.amount,
                    (
                      wallets.find(
                        w => w.accountCode === invoiceSent.walletCode
                      ) || {}
                    ).currencyString
                  )}
              </p>
              <p>to {invoiceSent.customerName}.</p>
              <hr />
              <div className="invoice-sent--link">
                <p className="invoice-sent--icon-text">
                  <span className="invoice-sent--icon">{icons.link}</span>
                  Click&nbsp;
                  <a onClick={this.openInvoiceLink} target="_blank">
                    here
                  </a>
                  &nbsp;or share this invoice via a&nbsp;
                  <a
                    href={invoiceSent.sharedLink}
                    onClick={this.showClipboard}
                    onBlur={this.hideClipboard}
                  >
                    share link
                  </a>
                  {showClipboard && (
                    <div className="invoice-sent--clipboard">
                      <p className="invoice-sent--clipboard-head">
                        <span className="invoice-sent--clipboard-icon">
                          {icons.checked}
                        </span>
                        Copied to clipboard
                      </p>
                      <p className="invoice-sent--clipboard-url">
                        {invoiceSent.sharedLink}
                      </p>
                    </div>
                  )}
                </p>
              </div>
              <button className="btn btn-success " onClick={this.onHide}>
                &nbsp;&nbsp;Close&nbsp;&nbsp;
              </button>
            </div>
          )}
        </FullScreen>
      </div>
    );
  }
}

export default connect(
  state => {
    const map = {};
    const arr = state.wallets.data;

    arr.forEach(item => {
      map[item.accountCode] = item.disabled;
    });

    return {
      wallets: arr,
      walletDisabledMap: map
    };
  },
  ossActions
)(Invoices);
