import React, { Component } from 'react';
import { Grid } from 'react-flexbox-grid';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import DetailForm from '../../forms/Wallets/Detail';
import Link from 'react-toolbox/lib/link';
import api from '../../api';

class Wallets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgId: this.props.orgId,
      data: [],
      selected: {},
      modal: false
    };
  }

  componentDidMount = () => {
    this.getList();
  };

  async getList() {
    const { data } = await api.wallets.list({
      orgId: this.state.orgId,
    });
    if (data.code === 0) {
      this.setState({
        data: data.wallets,
      });
    }
  }

  async saveDetail(code, request) {
    const resp = await api.wallets.patch(code, request);
    // refresh list 
    if (resp.status === 200) {
       this.getList();
       this.handleModal();
    } 
  }

  onDetailSubmit = (form) => {
    const code = form.accountCode;
    const request = {
      mccCode: form.mccCode,
      subMchId: form.subMchId
    }

    this.saveDetail(code, request);
  }

  showDetail = item => {
    this.setState(
      {
        selected: item,
      },
      this.handleModal
    );
  };

  goToTransactions(item) {
    //console.log("### item ###")
    //console.log(item)
    this.props.history.push({
      pathname: `/org/${this.state.orgId}/transactions/${item.accountCode}`,
      state: { walletId: item.accountCode },
    });
  }

  handleModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  render() {
    return (
      <div>
      <Grid fluid>
        <Table selectable={false} style={{ margin: 10 }}>
          <TableHead>
            <TableCell>Code</TableCell>
            <TableCell>Account Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Wechat secondary ID</TableCell>
            <TableCell>Alipay MCC code</TableCell>
          </TableHead>
          {this.state.data.map((item, idx) => {
            const { accountCode, accountName, amount, currencyString, paymentMethodString, subMchId, mccCode } = item;
            return (
              <TableRow key={idx} onClick={() => this.showDetail(item)}>
                <TableCell>
                  <Link label={accountCode} onClick={() => this.goToTransactions(item)} />
                </TableCell>
                <TableCell>
                  {accountName}
                </TableCell>
                <TableCell>
                  {amount} {currencyString}
                </TableCell>
                <TableCell>
                  {paymentMethodString}
                </TableCell>
                <TableCell>
                  {subMchId}
                </TableCell>
                <TableCell>
                  {mccCode}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
        <Dialog
          active={this.state.modal}
          onEscKeyDown={this.handleModal}
          onOverlayClick={this.handleModal}
          title="Wallet Detail">
          <DetailForm hideModal={this.handleModal} 
                      onSubmit={this.onDetailSubmit} 
                      initialValues={this.state.selected}
                      />
        </Dialog>
      </Grid>
      </div>
    );
  }
}

export default Wallets;
