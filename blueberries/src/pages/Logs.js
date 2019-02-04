import React, { Component } from 'react';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import { Grid } from 'react-flexbox-grid';
import Search from '../forms/Search/Logs';
import Link from 'react-toolbox/lib/link';
import api from '../api';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Pagination from '../components/Pagination';

class Logs extends Component {
  state = {
    data: [],
    pageNo: 1,
    pageSize: 10,
    pageTotal: Number,
    search: {
        fuzzyString: null,
        type: null,
        status: null,
        startTime: null,
        endTime: null,
        verifyStatus: null,
    },
    jsonModal: false,
    jsonModalValue: Object,
  };
  
  componentDidMount = () => {
    this.getList();
  };

  async getList(form) {
    
    const params = Object.assign({
       pageNo: this.state.pageNo,
       pageSize: this.state.pageSize,
    }, this.state.search);

    try {
      const { data } = await api.logs.list(params);
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

  gotoPage = pageNo => {
    this.setState({
        pageNo,
      },
      this.getList
    );
  };

  onSearchSubmit = form => {
    this.setState({
      pageNo: 1,
      search: form
    }, this.getList);
  };

  showJsonModal(value) {
    this.setState({
      jsonModal: true,
      jsonModalValue: JSON.parse(value)
    });
  }

  hideJsonModal() {
    this.setState({
      jsonModal: false,
    });
  }

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
          {data.length === 0 ?
          null
          :
          <Table selectable={false} style={{ margin: 10 }}>
            <TableHead>
              <TableCell>IP</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Wallet ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Params</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date & Time</TableCell>
            </TableHead>
            {data.map((item, idx) =>
              <TableRow key={idx}>
                <TableCell>
                  {item.ip}
                </TableCell>
                <TableCell>
                  {item.orderId}
                </TableCell>
                <TableCell>
                  {item.walletId}
                </TableCell>
                <TableCell>
                  {item.userId}
                </TableCell>
                <TableCell>
                  <Link label="JSON" onClick={() => this.showJsonModal(item.params)}/>
                </TableCell>
                <TableCell>
                  {item.status}
                </TableCell>
                <TableCell>
                  {item.type}
                </TableCell>
                <TableCell>
                  {item.created}
                </TableCell>
              </TableRow>
            )}
          </Table>
          }
          <Pagination total={pageTotal} current={pageNo} size={pageSize} onPageChange={this.gotoPage} />
          <Dialog
            active={this.state.jsonModal}
            onEscKeyDown={this.hideJsonModal.bind(this)}
            onOverlayClick={this.hideJsonModal.bind(this)}
            title="{ Params }" style={{overflow:'auto'}}>
            { 
              Object.keys(this.state.jsonModalValue).length > 0 ?
                <Table className="table-sm" selectable={false}>
                    { Object.keys(this.state.jsonModalValue).map((key) => { 
                          return (
                            <TableRow key={key} style={{wordWrap: 'break-word'}}>
                              <TableCell>
                                    {key}
                              </TableCell>
                              <TableCell>
                                    {this.state.jsonModalValue[key]}
                              </TableCell>
                              </TableRow>  
                            )
                        })
                    }
                </Table>
              : null 
            }
          </Dialog>
        </Grid>
      </div>
    );
  }
}

export default Logs;