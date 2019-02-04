import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button/Button';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';

import { renderInput, renderDropdown } from '../Fields';
import { actions as constantsActions } from '../../redux/ducks/constants';

export const SearchForm = props => {
  const { handleSubmit, submitting, constants } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ overflow: 'initial' }}>
        <CardTitle title="Search" />
        <Row>
          <Col xs={12} sm={4}>
            <Field name="fuzzyString" type="text" component={renderInput} label="Search" />
          </Col>

          <Col xs={12} sm={4}>
            <Field name="currency" component={renderDropdown} source={constants.lookups.currencies} label="Currency" />
          </Col>

          <Col xs={12} sm={4}>
            <Field name="status" component={renderDropdown} source={[{value:'0', label:'Disabled'}, {value:'1', label:'Enabled'}]} label="Status" />
          </Col>
        </Row>
        <Row end="xs">
          <Col>
            <Button icon="search" label="Search" type="submit" disabled={submitting} raised primary />
          </Col>
        </Row>
      </Card>
    </form>
  );
};

export default connect(({ constants }) => ({ constants }), constantsActions)(
  reduxForm({
    form: 'search',
  })(SearchForm)
);
