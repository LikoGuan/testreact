import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DocumentForm from '../../forms/Document';
import { actions as OSSActions } from '../../redux/ducks/oss';
import { traverse, stringToDate } from '../../util';
import api from '../../api';

class Document extends Component {
  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {};

  componentDidMount() {
    this.props.OSSToFetch();
    this.loadData();
  }

  async loadData() {
    const { orgId } = this.props;
    const { data = {} } = await api.documents.id(orgId);
    this.setState({
      data,
    });
  };

  async onSubmit(form) {
    const { orgId } = this.props;

    await api.documents.update(orgId, form);
    await this.loadData();
  };

  render() {
    const { data } = this.state;
    const newData = traverse(data, stringToDate);

    return (
      <Grid fluid>
        <Row around="xs">
          <Col xs={12} sm={10}>
            <h2>Document</h2>
            <DocumentForm onSubmit={this.onSubmit} enableReinitialize={true} initialValues={newData} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(undefined, OSSActions)(Document);
