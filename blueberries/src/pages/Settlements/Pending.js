import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button/Button';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown';
import Search from '../../forms/Search/SettlementPending';
import api from '../../api';
import { dateToYYYYMMDD, keyToName } from '../../util';

const getc = c => {
  return { '1': 'NZD', '2': 'AUD', '3': 'USD' }[c];
};
// const gets = s => {
//   return { '0': 'disabled', '1': 'enabled' }[s];
// };
class SettlementsPending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      banks: [],
      bankSelected: null,
      modal: false,
      settlemodal: false,
      selected: {},
      selectedItems: [],
      search: {
        fuzzyString: '',
        currency: null,
        startTime: null,
        endTime: null,
        status: null,
      },
    };
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }

  async componentDidMount() {
    this.getList();

    const { data } = await api.systemBank.list();
    if (data.code === 0) {
      const b = data.banks.find(bank => bank.primaryBank === 1);
      if (!b) {
        alert('setup primary bank first');
      } else {
        this.setState({
          bankSelected: b.id,
          banks: data.banks,
        });
      }
    }
  }

  async getList() {
    const { search } = this.state;
    const { fuzzyString, startTime, endTime, currency } = search;

    const { data } = await api.settlement.list({
      fuzzyString,
      startTime: dateToYYYYMMDD(startTime),
      endTime: dateToYYYYMMDD(endTime),
      currency,
      status: 0,
    });

    if (data.code === 0) {
      const array = data.page.result;
      this.setState({
        data: array,
        selectedItems:[...Array(array.length).keys()]
      });
    }
  }

  handleModal = () => {
    this.setState({ modal: false, settlemodal: false });
  };

  showDetail = item => {
    const currencies = {1: 'NZD', 2: 'AUD', 3: 'USD', 4: 'SGD', 5: 'CNY'};
    const types = {0: 'WITHDRAW', 1: 'AUTO_WITHDRAW', 2: 'REFUND', 3: 'AUTO_WITHDRAW_BACKUP'};
    
    const newItem = {...item}
    const currency = currencies[item.currency];
    if (currency) {
      newItem['currency'] = currency;
    }
    const type = types[item.type]; 
    if (type) {
      newItem['type'] = type;
    }
    
    this.setState({
      selected: newItem,
      modal: true,
    });
  };
  onSettle = () => {
    this.setState({
      settlemodal: true,
    });
  };
  async approve() {
    if (!window.confirm('are you sure?')) return;
    await api.settlement.approve({
      settlementIds: this.state.selectedItems.map(index => this.state.data[index].settlementId).join(','),
      bankId: this.state.bankSelected,
    });
    window.location.reload();
  }
  async reject() {
    const comment = window.prompt('Please enter your comment', '');
    if (!comment) return;
    await api.settlement.reject({
      settlementId: this.state.selectedItems.map(index => this.state.data[index].settlementId).join(','),
      comment,
    });
    window.location.reload();
  }
  search = form => {
    this.setState(
      {
        search: form,
        page: 1,
      },
      this.getList
    );
    return false;
  };

  handleSelect = selectedItems => {
    this.setState({ selectedItems });
  };
  render() {
    const { data, search, selectedItems } = this.state;

    const keys = [
      'settlementId',
      'createdDate',
      'walletName',
      'merchantId',
      'transactionId',
      'amount',
      'currency',
      'processedDate',
      'status',
    ];

    return (
      <Grid fluid>
        <Search onSubmit={this.search} initialValues={search} />
        <Table 
          style={{ margin: 10 }}
          onRowSelect={this.handleSelect}
          selected={selectedItems}
          selectable
          multiSelectable >

          <TableHead>
            {keys.map(key => (
              <TableCell key={key}>
                { keyToName(key) }
              </TableCell> 
            ))}
          </TableHead>

          {data.map((item, idx) => ( 
            <TableRow key={item.settlementId + idx} selected={selectedItems.indexOf(idx) !== -1}>
              {keys.map((key, idx) => (
                <TableCell key={idx} onClick={() => this.showDetail(item)} >
                    { key === 'currency' ? getc(item[key]) : item[key] }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>

        <Row>
          <Col sm={3}>
            <p>Please select settlement bank</p>
          </Col>
          <Col sm={9}>
            <Dropdown
              source={this.state.banks.filter(bank => bank.status === 1).map(bank => ({
                value: bank.id,
                label: bank.accountName,
              }))}
              onChange={value => this.setState({ bankSelected: value })}
              value={this.state.bankSelected}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button label="Approve" type="submit" raised primary onClick={this.approve} />
          </Col>
          <Col>
            <Button label="Reject" type="submit" raised primary onClick={this.reject} />
          </Col>
        </Row>

        <Dialog
          active={this.state.settlemodal}
          onEscKeyDown={this.handleModal}
          onOverlayClick={this.handleModal}
          title="Settlement"
        >
          <Grid fluid>
            <Row>
              <Col>
                <h3>Select settlement bank</h3>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>Account name</Col>
              <Col sm={6}>1</Col>
              <Col sm={6}>Account number</Col>
              <Col sm={6}>1</Col>
              <Col sm={6}>Balance</Col>
              <Col sm={6}>1</Col>
              <Col sm={6}>Currency</Col>
              <Col sm={6}>1</Col>
            </Row>
          </Grid>
        </Dialog>

        <Dialog
          active={this.state.modal}
          onEscKeyDown={this.handleModal}
          onOverlayClick={this.handleModal}
          title=" Detail"
        >
          <Table className="table-sm" selectable={false}>
            {Object.keys(this.state.selected).map(key =>
              <TableRow key={key}>
                <TableCell>
                  {key}
                </TableCell>
                <TableCell>
                  {this.state.selected[key]}
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Dialog>
      </Grid>
    );
  }
}

export default connect(({ constants }) => ({ constants }))(SettlementsPending);
