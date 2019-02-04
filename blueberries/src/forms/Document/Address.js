import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';

import { renderInput, renderAutoComplete } from '../Fields';

class Address extends Component {
  render() {
    const { constants } = this.props;

    return (
      <Row>
        <Col xs={12} sm={3}>
          <Field
            id="country"
            name="country"
            type="text"
            component={renderAutoComplete}
            isUseLabelsAsKeys={true}
            source={constants.lookups.countries}
            label="country"
          />
        </Col>
        <Col xs={12} sm={3}>
          <Field id="city" name="city" type="text" component={renderInput} label="city" />
        </Col>
        <Col xs={12} sm={6}>
          <Field id="suburb" name="suburb" type="text" component={renderInput} label="Suburb" />
        </Col>
        <Col xs={12} sm={6}>
          <Field id="street" name="street" type="text" component={renderInput} label="Street" />
        </Col>
        <Col xs={12} sm={6}>
          <Field id="zipcode" name="zipcode" type="text" component={renderInput} label="Post code" />
        </Col>
      </Row>
    );
  }
}

export default connect(state => state)(Address);
