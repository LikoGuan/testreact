import React, { Component } from "react";
import { Pagination } from "react-bootstrap";
import Alert from "react-s-alert";
import numeral from "numeral";

import api from "../api";

class Invoices extends Component {
  constructor() {
    super();
    this.state = {
      invoices: [],
      invoice: {},
      invoiceQueries: {
        page: 1,
        size: 10,
        from: null,
        to: null
      },

      prepayCoupons: [],
      prepayCouponQueries: {
        page: 1,
        size: 10,
        from: null,
        to: null
      }
    };
  }
  componentDidMount() {
    this.getInvoices();
    this.getPrepayCoupons();
  }

  async getInvoices() {
    const { size, page } = this.state.invoiceQueries;

    const para = {
      pageSize: size,
      pageNo: page
    };

    const { data } = await api.coupons.list(para);
    if (data.code === 0) {
      console.log(data.page);

      this.setState({
        invoices: data.page.result || [],
        invoiceQueries: {
          ...this.state.invoiceQueries,
          page: data.page.currentPageNo,
          total: data.page.totalNum
        }
      });
    }
  }
  async getPrepayCoupons() {
    const { size, page } = this.state.prepayCouponQueries;

    const para = {
      pageSize: size,
      pageNo: page
    };

    const { data } = await api.coupons.prepayList(para);
    if (data.code === 0) {
      console.log(data.page);

      this.setState({
        prepayCoupons: data.page.result || [],
        invoiceQueries: {
          ...this.state.invoiceQueries,
          page: data.page.currentPageNo,
          total: data.page.totalNum
        }
      });
    }
  }

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
  prepayCouponGoto = page => {
    this.setState(
      {
        prepayCouponQueries: {
          ...this.state.prepayCouponQueries,
          page
        }
      },
      this.getPrepayCoupons
    );
  };

  onAddInvoice = () => {
    this.form = {};
    this.props.fetchOSS();
    this.setState({ modal_invoice: true });
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

  renderInvoice = invoice => {
    const {
      id,
      validFrom,
      validTo,
      type,
      discount,
      discountRate,
      takenNum,
      redeemedNum
    } = invoice;

    let name = "";
    if (type === 1 && discount) {
      name = "-$" + discount;
    } else if (type === 2 && discountRate) {
      name =
        numeral(discountRate)
          .multiply(100)
          .value() + "% off";
    }
    return (
      <tr key={id}>
        <td>{id}</td>
        <td>{name}</td>
        <td className="hidden-xs">{validFrom}</td>
        <td className="hidden-xs">{validTo}</td>
        <td>{takenNum}</td>
        <td>{redeemedNum}</td>
      </tr>
    );
  };

  renderPrepayCoupon = invoice => {
    const {
      id,
      preferentialInfo,
      validFrom,
      validTo,
      takenNum,
      redeemedNum
    } = invoice;

    return (
      <tr key={id}>
        <td>{id}</td>
        <td>{preferentialInfo}</td>
        <td className="hidden-xs">{validFrom}</td>
        <td className="hidden-xs">{validTo}</td>
        <td>{takenNum}</td>
        <td>{redeemedNum}</td>
      </tr>
    );
  };

  render() {
    const {
      invoices,
      invoiceQueries,

      prepayCoupons = [],
      prepayCouponQueries
    } = this.state;

    return (
      <div className="coupon lat-content">
        <h1 className="lat-greeting">Coupons</h1>
        <p className="intro">
          Dear Valued LatiPay merchant, once you upload the coupon doc, we will
          help and contact you in 3-5 working days. <br />
          <a
            className="link"
            href={
              process.env.PUBLIC_URL +
              "/Creating a Coupon in Discovery-钱多多app 优惠券内容填写（中英文版）.doc"
            }
          >
            Download template
          </a>{" "}
          and fill your coupon information.
        </p>

        <a
          className="btn btn-success btn-create-invoice"
          href="mailto:customerservice@latipay.net?subject=Coupon template"
        >
          Upload Coupon
        </a>

        <div className="lat-content">
          <div className="page-header lat-page-header lat-history-header">
            <p>Coupon Details</p>
          </div>
          <div className="lat-table lat-placeholder">
            <table className="table table-hover ">
              <thead>
                <tr>
                  <th>
                    <div className="btn btn-default btn-nullify">ID</div>
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">Name</div>
                  </th>

                  <th className="hidden-xs">
                    <div className="btn btn-default btn-nullify">
                      Start Date
                    </div>
                  </th>
                  <th className="hidden-xs">
                    <div className="btn btn-default btn-nullify">End Date</div>
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">
                      Token Count
                    </div>
                  </th>
                  <th>
                    <div className="btn btn-default btn-nullify">
                      Used Count
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

          <div>
            <div className="page-header lat-page-header lat-history-header">
              <p>Prepay Coupon Details</p>
            </div>
            <div className="lat-table lat-placeholder">
              <table className="table table-hover ">
                <thead>
                  <tr>
                    <th>
                      <div className="btn btn-default btn-nullify">ID</div>
                    </th>
                    <th>
                      <div className="btn btn-default btn-nullify">Name</div>
                    </th>

                    <th className="hidden-xs">
                      <div className="btn btn-default btn-nullify">
                        Start Date
                      </div>
                    </th>
                    <th className="hidden-xs">
                      <div className="btn btn-default btn-nullify">
                        End Date
                      </div>
                    </th>
                    <th>
                      <div className="btn btn-default btn-nullify">
                        Token Count
                      </div>
                    </th>
                    <th>
                      <div className="btn btn-default btn-nullify">
                        Redeem Count
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>{prepayCoupons.map(this.renderPrepayCoupon)}</tbody>
              </table>
              <div className="lat-footer-op">
                <Pagination
                  bsSize="small"
                  items={Math.ceil(
                    prepayCouponQueries.total / prepayCouponQueries.size
                  )}
                  maxButtons={5}
                  activePage={prepayCouponQueries.page}
                  onSelect={this.prepayCouponGoto}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Invoices;
