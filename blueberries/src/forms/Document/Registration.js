import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Field, FormSection, FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';

import { renderInput, renderDatePicker, renderAutoComplete } from '../Fields';
import Address from './Address';
import FileList from './FileList';

class Registration extends Component {
  render() {
    const { constants } = this.props;
    return (
      <Card>
        <CardTitle title="Company registration" />
        <Row>
          <Col xs={12} sm={6}>
            <Field id="name" name="name" type="text" component={renderInput} label="Company name" />
          </Col>
          <Col xs={12} sm={6}>
            <Field id="number" name="number" type="text" component={renderInput} label="Company number" />
          </Col>

          <Col xs={12} sm={6}>
            <Field
              id="placeOfIssue"
              name="placeOfIssue"
              type="text"
              component={renderAutoComplete}
              isUseLabelsAsKeys={true}
              source={constants.lookups.countries}
              label="Place of issue"
            />
          </Col>

          <Col xs={12} sm={6}>
            <Field id="dateofissue" name="dateOfIssue" component={renderDatePicker} label="Date of issue" />
          </Col>

          <Col xs={12} sm={6}>
            <Field id="expireDate" name="expireDate" type="text" component={renderDatePicker} label="Expire Date" />
          </Col>
          <Col xs={12} sm={6} />
        </Row>
        <FormSection name="address">
          <Address />
        </FormSection>
        <FieldArray name="files" component={FileList} />
      </Card>
    );
  }
}

export default connect(state => state)(Registration);
