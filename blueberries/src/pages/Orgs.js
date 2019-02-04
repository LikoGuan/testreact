import React, { Component } from 'react';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import { Grid } from 'react-flexbox-grid';
import Search from '../forms/Search/Orgs';
import Link from 'react-toolbox/lib/link';
import Pagination from '../components/Pagination';

import moment from 'moment';

import api from '../api';

class Organisations extends Component {
  
   constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageNo: 1,
      pageSize: 10,
      pageTotal: undefined,
      search: {
          fuzzyString: null,
          merchantType: null,
          status: null,
          riskLevel: null,
          dateType: null,
          startTime: null,
          endTime: null,
      }
    };
  }

  componentDidMount = () => {
    this.getList();
  };

  async getList() {
    
    const params = Object.assign({
      pageNo: this.state.pageNo,
       pageSize: this.state.pageSize,
    }, this.state.search);

    try {
      const { data } = await api.organisations.list(params);
      // OK
      if (data.code === 0) {
        this.setState({
          data: data.page.result,
          pageNo: data.page.currentPageNo,
          pageTotal: data.page.totalNum,
        });
      } 
    } catch(error) {
      // TODO treat specific error, display error message
      // if(error.status === 404) {
      // }
      this.setState({
        data: [],
        // error: resp.statusText,
      });
    }
  }
 
  async changeStatus(id, request) {
    const resp = await api.organisations.patch(id, request);
    // refresh list 
    if (resp.status === 200) {
       this.getList();
    } 
  }

  goToProfile(item) {
    this.props.history.push({
      pathname: `/org/${item.id}/profile`,
      state: { id: item.id },
    });
  }

  gotoPage = pageNo => {
    this.setState({
        pageNo,
    }, this.getList);
  };

  onSearchSubmit = form => {
    this.setState({
      pageNo: 1,
      search: form
    }, this.getList);
  };

  handleSwitchChange = (orgId, value) => {
    const request = {
      enabled: value
    }
    this.changeStatus(orgId, request)
  };

  render() {
    const { data } = this.state;
    if (!data) {
      return (<div></div>);
    }
    const { pageNo, pageTotal, pageSize } = this.state;
    return (
      <div>
        <Grid fluid style={{ marginBottom: 30 }}>
            <Search onSubmit={this.onSearchSubmit}/>
            {data.length > 0 &&

            <Table selectable={false} style={{ margin: 10 }}>
              <TableHead>
                <TableCell>Merchant Id</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Legal name / Company name</TableCell>
                <TableCell>Contact email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Onboarding Date</TableCell>
                <TableCell>Verification Date</TableCell>
                <TableCell>Sales</TableCell>
              </TableHead>
              {data.map((item, idx) =>
                <TableRow key={idx}>
                  <TableCell>
                    <Link label={item.id.toString()} onClick={() => this.goToProfile(item)}/>
                  </TableCell>
                  <TableCell>
                    {item.merchantType}
                  </TableCell>
                  <TableCell>
                    {item.riskLevelType}
                  </TableCell>
                  <TableCell>
                    {item.contactName}
                  </TableCell>
                  <TableCell>
                    {item.contactEmail}
                  </TableCell>
                  <TableCell>
                    {item.verificationStatus}
                  </TableCell>
                  <TableCell>
                    { moment(item.created).format('YYYY-MM-DD') }
                  </TableCell>
                  <TableCell>
                    { moment(item.verificationDate).format('YYYY-MM-DD') }
                  </TableCell>
                  <TableCell>
                    {item.salesPerson}
                  </TableCell>
                </TableRow>
              )}
            </Table>
            }
            <Pagination total={pageTotal} current={pageNo} size={pageSize} onPageChange={this.gotoPage} />
        </Grid>
      </div>
    );
  }
}

export default Organisations;