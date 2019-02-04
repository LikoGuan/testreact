/**
 * Created by gavinmilbank on 10/07/17.
 */
import React, {Component} from 'react';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Button from 'react-toolbox/lib/button/Button';
import {Row} from 'react-flexbox-grid';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';

class ServerException extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowStack: false
    };
  }
  toggleStack = () => {
     this.setState({isShowStack:!this.state.isShowStack});
  }
  render() {
    const props = this.props;

    const {config, data, status, statusText} = props.error.response;
    if (!data) {
      return (
        <Card>
          <CardTitle>Server error</CardTitle>
          <Row>
            <text>Unknown server error : {config.method}  {config.url} {status} {statusText}</text>
          </Row>
          <Row>
            <Button label='Close' raised type="button" onClick={props.close} style={{float:"right"}}/>
          </Row>
        </Card>
      );
    } else {
      return (
        <Card>
          <CardTitle>{data.message}</CardTitle>
          <Row>
            {data.stack &&  <Button label={this.state.isShowStack?'Hide Stack':'Show Stack'} raised type="button"
                    onClick={this.toggleStack} style={{horizAlign:"right"}}/>}
            <Button label='Close' raised type="button" onClick={props.close} style={{horizAlign:"right"}}/>
          </Row>
          {data.stack && this.state.isShowStack && <Row style={{overflow: "auto"}}>
            <Table selectable={false} style={{margin: 10}}>
              <TableHead>
                <TableCell>Declaring Class</TableCell>
                <TableCell>Method Name</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Line Number</TableCell>
              </TableHead>
              {data.stack.map((frame, idx) => {
                const {declaringClass, methodName, fileName, lineNumber} = frame;
                return (
                  <TableRow key={idx}>
                    <TableCell>{declaringClass}</TableCell>
                    <TableCell>{methodName}</TableCell>
                    <TableCell>{fileName}</TableCell>
                    <TableCell>{lineNumber}</TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </Row>}
        </Card>
      );
    }
  }
}

export default ServerException;
