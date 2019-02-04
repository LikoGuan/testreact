import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';

import { renderInput, renderDatePicker, renderAutoComplete } from '../Fields';

class Person extends Component {
  render() {
    const { constants } = this.props;
    return (
      <Row>
        <Col xs={12} sm={6}>
          <Field name="name" type="text" component={renderInput} label="Legal name" />
        </Col>
        <Col xs={12} sm={6}>
          <Field name="passport" type="text" component={renderInput} label="Passport number" />
        </Col>
        <Col xs={12} sm={6}>
          <Field
            name="nationality"
            type="text"
            component={renderAutoComplete}
            label="Nationality"
            isUseLabelsAsKeys={true}
            source={constants.lookups.countries}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Field name="dateOfBirth" component={renderDatePicker} label="Date of Birth" />
        </Col>
        <Col xs={12} sm={6}>
          <Field name="gender" type="text" source ={ [{value:'Male',label:'Male'},{value:'Female',label:'Female'}] }component={renderAutoComplete} label="Gender" />
        </Col>
        <Col xs={12} sm={6}>
          <Field
            name="placeOfBirth"
            type="text"
            component={renderAutoComplete}
            isUseLabelsAsKeys={true}
            source={constants.lookups.countries}
            label="Place of Birth"
          />
        </Col>
        <Col xs={12} sm={6}>
          <Field name="dateOfIssue" component={renderDatePicker} label="Date of Issue" />
        </Col>
        <Col xs={12} sm={6}>
          <Field name="expireDate" component={renderDatePicker} label="Expire Date" />
        </Col>
      </Row>
    );
  }
}

export default connect(state => state)(Person);
