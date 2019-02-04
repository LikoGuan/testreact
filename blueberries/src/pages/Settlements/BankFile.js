import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button/Button';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Search from '../../forms/Search/SettlementPending';
import api from '../../api';
import { dateToYYYYMMDD } from '../../util';
const getc = c => {
  return { '1': 'NZD', '2': 'AUD', '3': 'USD' }[c];
};
// const gets = s => {
//   return { '0': 'disabled', '1': 'enabled' }[s];
// };
class BankFile extends Component {
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
      page: 1,
      size: 10,
      search: {
        fuzzyString: '',
        currency: null,
        startTime: null,
        endTime: null,
      },
    };
  }

  async componentDidMount() {
    this.getList();
  }

  async getList() {
    const { search, size, page } = this.state;
    const { fuzzyString, startTime, endTime, currency } = search;

    const { data } = await api.settlement.bankfile({
      fuzzyString,
      startTime: dateToYYYYMMDD(startTime),
      endTime: dateToYYYYMMDD(endTime),
      currency,

      pageSize: size,
      pageNo: page,
    });

    if (data.code === 0) {
      this.setState({
        data: data.page.result,
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
    return (
      <Grid fluid>
        <Search onSubmit={this.search} initialValues={search} />
        <Table
          style={{ margin: 10 }}
          onRowSelect={this.handleSelect}
          selected={selectedItems}
          selectable
          multiSelectable
        >
          <TableHead>
            <TableCell>Processed Date</TableCell>
            <TableCell>Operation Staff</TableCell>
            <TableCell>Type</TableCell>

            <TableCell>Settle Bank Number</TableCell>
            <TableCell>Bank Name </TableCell>
            <TableCell> Currency</TableCell>
            <TableCell>Edit</TableCell>
          </TableHead>
          {data.map((item, idx) => {
            const { modifyDate, staff, type, bankAccountNumber, bankName, currency, bankFile, report } = item;
            return (
              <TableRow key={idx} selected={selectedItems.indexOf(idx) !== -1}>
                <TableCell onClick={() => this.showDetail(item)}>
                  {modifyDate}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {staff}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {type}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {bankAccountNumber}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {bankName}
                </TableCell>
                <TableCell onClick={() => this.showDetail(item)}>
                  {getc(currency)}
                </TableCell>
                <TableCell>
                  <Button href={bankFile} target="_blank" raised>
                    Bank file
                  </Button>
                  <Button href={report} target="_blank" raised>
                    Report
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>

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

export default connect(({ constants }) => ({ constants }))(BankFile);
