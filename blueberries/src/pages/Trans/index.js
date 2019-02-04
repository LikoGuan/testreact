import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid } from 'react-flexbox-grid';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Pagination from '../../components/Pagination';
import Search from '../../forms/Search/Transactions';
import api from '../../api';
import { dateToYYYYMMDD } from '../../util';
import Button from 'react-toolbox/lib/button/Button';
import Detail from './Detail';

class Transactions extends Component {
  constructor(props) {
    super(props);
    const { location: { state } } = this.props;
    this.state = {
      orgId: this.props.orgId,
      data: [],
      page: 1,
      size: 10,
      modal: false,
      confirmModal: false,
      selected: {},
      search: {
        type: [],
        fuzzyString: state && state.walletId ? state.walletId : '',
        currency: [],
        startTime: null,
        endTime: null,
        paymentMethod: [],
        accountCode: [],
        status: null,
        verifyStatus: null,
      },
      message: null
    };

    this.approveInvoice = this.approveInvoice.bind(this);
    this.handleAttachment = this.handleAttachment.bind(this);
  }

  componentDidMount = () => {
    this.getList();
    if (this.state.orgId) {
      this.getWallets();
    }
  };
  
  async getWallets() {
    const { data } = await api.wallets.list({
      orgId: this.state.orgId,
    });
    if (data.code === 0) {
      this.setState({
        wallets: data.wallets,
      });
    }
  }
  async getList() {
    const { orgId, size, page, search } = this.state;
    const { fuzzyString, accountCode, startTime, endTime, currency, type, paymentMethod, status, verifyStatus } = search;

    const { data } = await api.transactions.list({
      orgId,
      pageSize: size,
      pageNo: page,
      fuzzyString,
      accountCode: accountCode.join(','),
      startTime: dateToYYYYMMDD(startTime),
      endTime: dateToYYYYMMDD(endTime),
      currency: currency.join(','),
      type: type.join(','),
      paymentMethod: paymentMethod.join(','),
      status,
      verifyStatus,
    });

    if (data.code === 0) {
      this.setState({
        data: data.page.result,
        page: data.page.currentPageNo,
        total: data.page.totalNum,
      });
    }
  }

  async createRefund(form) {
    const resp = await api.refunds.create(form);
    if (resp.status === 200) {
       this.getList();
       this.handleConfirmModal();
    }
  }

  async approveInvoice() {
    const { data } = await api.invoice.approve(this.state.selected.customerOrderId);
    if (data.code === 0) {
      this.setState({ selected: {} }, ()=>{
        this.handleModal(this.getList)
      });
    } else {
      this.setState({
        message: data.message
      });
    }
  }

  async handleAttachment(form) {
    const resp = await api.transactions.updateAttachment({id: this.state.selected.customerOrderId, attachments: form.attachments});

    if (resp.status === 200) {
      this.getList();
    }else {
      this.setState({
        message: resp.data.message
      });
    }
  };

  handleConfirmModal = () => {
    this.setState({ confirmModal: !this.state.confirmModal });
  };

  handleModal = (callback) => {
    this.setState({ modal: !this.state.modal, message: null }, callback);
  };

  cancelModal = () => {
    this.setState({ modal: false, message: null });
  };

  showConfirmModal = item => {
    this.setState(
      {
        selected: item,
      },
      this.handleConfirmModal
    );
  };

  showDetail = item => {

    this.setState(
      {
        selected: item,
      },
      this.handleModal
    );
  };

  search = form => {
    this.setState(
      {
        search: form,
        page: 1,
      },
      this.getList
    );
  };

  gotoPage = page => {
    this.setState(
      {
        page,
      },
      this.getList
    );
  };

  confirmRefund = () => {
    let request = {
      orderId: this.state.selected.orderId,
    }
    this.createRefund(request)
  };

  needShowApproveButton = item => {
    return item.type === 'Invoice' &&
      item.customerOrderId && 
      item.status==='success' && 
      item.verifyStatus!=='completed';
  }


  /* refundFlag
  *  0 = NOT,
  *  1 = PARTIAL,
  *  2 = FULL,
  *  3 = EXPIRED,
  *  4 = NOTSUPPORT;
  */
  canBeRefunded = ({type, refundFlag, status, verifyStatus}) => {
    if (type === 'Online' ||
        type === 'SpotPay' ||
        type === 'StaticPay' ) {

      return refundFlag === 0 && status === 'success';
    }else if (type === 'Invoice'){
      return verifyStatus === 'completed';
    }

    return false;
  }

  refundDescription = (flag) => {
    const mapping = {0: 'No', 1: 'Partial', 2: 'Yes', 3: 'Expired', 4: 'Not Available'};
    return mapping[flag] || '';
  }


  filteredInfo = item => {
    const labelMap = [
      {name: 'Transaction ID', keys:['orderId']}, 
      {name: 'Amount', keys:['amount', 'currency'], joinSeparator: ' '}, 
      {name: 'Pay amount', keys:['payAmount']},
      {name: 'Status', keys:['status']},
      {name: 'Verify status', keys:['verifyStatus']},
      {name: 'Refund', keys:['refundFlag'], cal: this.refundDescription},

      {name: 'Wallet ID / Name', keys:['accountCode', 'accountName'], joinSeparator: ' / '}, 
      {name: 'Merchant ID / Name', keys:['organisationId', 'merchantName'], joinSeparator: ' / '}, 
      {name: 'Created on', keys:['createDate']},
      {name: 'Processed on', keys:['modifyDate']},

      {name: 'Reference', keys:['reference']}, 
      {name: 'Description', keys:['productName']},

      {name: 'User ID', keys:['userId']}, 
      {name: 'User Name', keys:['userName']}, 
      {name: 'User Email', keys:['merchantEmail']},
    ];

    const info = labelMap.reduce((result, row) => {
      const value = row.keys.map(key=>{
        const obj = item[key] || '';
        return row.cal ? row.cal(obj) : obj
      })
      .filter(item=>true&&item);

      if (value.length > 0 || !row.hideIfNone) {
        result.push({
          name: row.name,
          separator: row.separator,
          joinSeparator: row.joinSeparator,
          value: value,
        });
      }
      return result;
    }, []);

    if (item.type==='Invoice' && item.customerOrderId){
      return [{
        name: 'Invoice ID',
        value: [item.customerOrderId],
      }].concat(info)
    }

    return info;
  }

  render() {
    const { orgId, wallets, data, search, page, total, size } = this.state;

    const info = this.filteredInfo(this.state.selected);

    return (
      <Grid fluid>
        <Search onSubmit={this.search} initialValues={search} wallets={wallets} orgId={orgId} />
        <Table selectable={false} style={{ margin: 10 }}>
          <TableHead>
            <TableCell>Order Id</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Wallet Id</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Verify Status</TableCell>
            <TableCell style={{textAlign:'center'}}>Refund</TableCell>
          </TableHead>
          {data.map((item, idx) => {
            const { orderId, amount, currency, paymentMethod, accountCode, status, verifyStatus} = item;
            return (
              <TableRow key={idx}>
                <TableCell onClick={() => this.showDetail(item)}>
                  {orderId}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {amount + ' ' + currency}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {paymentMethod}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {accountCode}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {status}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {verifyStatus}
                </TableCell>
                <TableCell style={{textAlign:'center'}}>
                  <Button icon='attach_money' label='Refund' raised onClick={() => this.showConfirmModal(item)} disabled={!this.canBeRefunded(item)}/>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
        <Pagination total={total} current={page} size={size} onPageChange={this.gotoPage} />
        <Dialog
          actions={[ { label: "Cancel", onClick: this.handleConfirmModal },
                     { label: "Confirm", onClick: this.confirmRefund } ]}
          active={this.state.confirmModal}
          onEscKeyDown={this.handleConfirmModal}
          onOverlayClick={this.handleConfirmModal}
          title='Confirm to Refund'>
          <p>Are you sure you want to refund this transaction?</p>
        </Dialog>

        <Detail 
          info={info} 
          cancelModal={this.cancelModal} 
          active={this.state.modal} 
          approveInvoice={this.approveInvoice} 
          needShowAttachment={this.state.selected.type === 'Invoice'}
          needShowApproveButton={this.needShowApproveButton(this.state.selected)} 
          message={this.state.message} 
          attachments={this.state.selected.attachments || []}
          handleAttachment={this.handleAttachment}
        />

      </Grid>
    );
  }
}

export default connect(({ constants }) => ({ constants }))(Transactions);
