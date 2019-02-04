import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button/Button';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import api from '../../api';
import SystemBankForm from '../../forms/systemBank';
import Search from '../../forms/Search/SettlementBankList';

const getc = c => {
  return { '1': 'NZD', '2': 'AUD', '3': 'USD' }[c];
};
const gets = s => {
  return { '0': 'disabled', '1': 'enabled' }[s];
};

class BankList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modal: false,
      selected: {},
      search: {
        fuzzyString: '',
        currency: null,
        status: null,
      },
      isEdit: false,
      disableOrEnableTip: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.confirmDisableOrEnable = this.confirmDisableOrEnable.bind(this);
  }

  componentDidMount = () => {
    this.getList();
  };

  async getList(newState) {
    const { search } = this.state;
    const { fuzzyString, currency, status } = search;

    const { data } = await api.systemBank.list({
      fuzzyString,
      currency,
      status,
    });
    if (data.code === 0) {
      this.setState({
        data: data.banks,
        ...newState
      });
    }
  }
  search = form => {
    this.setState(
      {
        search: form,
        page: 1,
      },
      this.getList
    );
  };

  handleModal = () => {
    this.setState({ modal: false, settlemodal: false, isEdit: false });
  };

  showDetail = item => {
    this.setState({
      selected: item,
      modal: true,
    });
  };
  onAdd = () => {
    this.setState({
      selected: {},
      modal: true,
    });
  };
  async onSubmit(form) {
    if (!form.id) {
      await api.systemBank.create(form);
    } else {
      await api.systemBank.update(form.id, form);
    }
    window.location.reload();
  }
  setp = item => {
    api.systemBank.setprimary(item.id);
  };
  e = item => {
    this.setState({
      selected: item,
      modal: true,
      isEdit: true
    });
  };
  d = (item, disableOrEnableTip) => {
    this.setState({
      selected: item,
      disableOrEnableTip: disableOrEnableTip
    });
  };
  hideConfirmModal = () => {
    this.setState({ disableOrEnableTip: '' });
  };
  async confirmDisableOrEnable() {
    const {id, status} = this.state.selected;
    
    let resp = {};
    if (status === 1) {
      resp = await api.systemBank.disable(id);
    }else {
      resp = await api.systemBank.enable(id);
    }

    if (resp.status === 200) {
      this.getList({ disableOrEnableTip: '', selected: null });
    }
  }
  render() {
    const { data, selected, search, isEdit, disableOrEnableTip} = this.state;
    return (
      <Grid fluid>
        <Search onSubmit={this.search} initialValues={search} />
        <Row end="xs">
          <Col>
            <Button label="Add new" type="submit" raised primary onClick={this.onAdd} />
          </Col>
        </Row>
        <Table selectable={false} style={{ margin: 10 }}>
          <TableHead>
            <TableCell>Bank account name</TableCell>
            <TableCell>Account number</TableCell>
            <TableCell>Bank name</TableCell>
            <TableCell>Account balance </TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Edit</TableCell>
          </TableHead>
          {data.map((item, idx) => {
            const { accountName, accountNumber, bankName, amount, currency, status } = item;
            return (
              <TableRow key={idx}>
                <TableCell onClick={() => this.showDetail(item)}>
                  {accountName}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {accountNumber}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {bankName}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {amount}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {getc(currency)}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {gets(status)}
                </TableCell>
                <TableCell>
                  <Button raised onClick={() => this.setp(item)}>
                    Set as primary
                  </Button>
                  <Button raised onClick={() => this.e(item)} >
                    Edit
                  </Button>
                  {status === 1
                    ? <Button raised onClick={() => this.d(item, 'Disable')}>
                        Disable
                      </Button>
                    : <Button raised onClick={() => this.d(item, 'Enable')}>
                        Enable
                      </Button>}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>

        <Dialog
          actions={[ { label: "Cancel", onClick: this.hideConfirmModal },
                     { label: "Confirm", onClick: this.confirmDisableOrEnable } ]}
          active={this.state.disableOrEnableTip!==''}
          onEscKeyDown={this.hideConfirmModal}
          onOverlayClick={this.hideConfirmModal}
          title={`${disableOrEnableTip} Bank Account`}>
          <p>{`Are you sure you want to ${disableOrEnableTip.toLowerCase()} this account?`}</p>
        </Dialog>

        <Dialog
          active={this.state.modal}
          onEscKeyDown={this.handleModal}
          onOverlayClick={this.handleModal}
          title="Detail"
        >
          <SystemBankForm onSubmit={this.onSubmit} initialValues={selected} isEdit={isEdit} />
        </Dialog>
      </Grid>
    );
  }
}

export default connect(({ constants }) => ({ constants }))(BankList);
