import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Pagination from '../../components/Pagination';
import Search from '../../forms/Search/SettlementHistory';
import api from '../../api';
import { dateToYYYYMMDD, keyToName } from '../../util';

const getc = c => {
  return { '1': 'NZD', '2': 'AUD', '3': 'USD' }[c];
};
// const gets = s => {
//   return { '0': 'disabled', '1': 'enabled' }[s];
// };

const Status = {
  Pending: 0,
  Completed: 1,
  Rejected: 2,
  Failed: 3,
};
class SettlementsPending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
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
        dateType: null,
      },
      page: 1,
      size: 10,
    };
    this.approve = this.approve.bind(this);
  }

  async componentDidMount() {
    this.getList();
  }

  async getList() {
    const { search, page, size } = this.state;
    const { fuzzyString, startTime, endTime, currency, status, dateType, } = search;

    //TODO status 换成1,2,3

    const { data } = await api.settlement.list({
      fuzzyString,
      startTime: dateToYYYYMMDD(startTime),
      endTime: dateToYYYYMMDD(endTime),
      currency,
      status: status?Status[status]:'1,2,3',
      pageSize: size,
      pageNo: page,
      dateType,
    });

    if (data.code === 0) {
      this.setState({
        data: data.page.result,
        page: data.page.currentPageNo,
        total: data.page.totalNum,
      });
    }
  }

  handleModal = () => {
    this.setState({ modal: false, settlemodal: false });
  };

  showDetail = item => {
    this.setState({
      selected: item,
      modal: true,
    });
  };
  onSettle = () => {
    this.setState({
      settlemodal: true,
    });
  };
  async approve() {
    await api.settlement.approve({
      settlementIds: this.state.selectedItems.map(index => this.state.data[index].settlementId).join(','),
      bankId: this.state.primaryBank,
    });
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

  gotoPage = page => {
    this.setState(
      {
        page,
      },
      this.getList
    );
  };

  handleSelect = selectedItems => {
    this.setState({ selectedItems });
  };
  render() {
    const { data, search, page, size, total } = this.state;
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
        <Table style={{ margin: 10 }} selectable={false}>
          <TableHead>
            {keys.map(key => (
              <TableCell key={key}>
                { keyToName(key) }
              </TableCell> 
            ))}
          </TableHead>

          {data.map((item, idx) => ( 
            <TableRow key={item.settlementId + idx}>
              {keys.map((key, idx) => (
                <TableCell key={idx} onClick={() => this.showDetail(item)} >
                    { key === 'currency' ? getc(item[key]) : item[key] }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
        <Pagination total={total} current={page} size={size} onPageChange={this.gotoPage} />

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
