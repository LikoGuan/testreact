import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

class SettlementBanks extends Component {
  componentDidMount() {
    this.setState({
      banks: [{}],
    });
  }
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col>
            <h3>Select bank</h3>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>Account name</Col>
          <Col sm={6} />
          <Col sm={6}>Account number</Col>
          <Col sm={6}>1</Col>
          <Col sm={6}>Balance</Col>
          <Col sm={6}>1</Col>
          <Col sm={6}>Currency</Col>
          <Col sm={6}>1</Col>
        </Row>
      </Grid>
    );
  }
}

export default SettlementBanks;
