import React from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import Button from 'react-toolbox/lib/button/Button';

import { renderInput, renderDropdown } from '../Fields';
import FileList from './FileList';
import theme from '../../toolbox/theme';

const BankAccount = ({ fields, meta: { error, submitFailed }, constants }) =>
  <div>
    <Button icon="add" flat primary label="Add bank account" onClick={() => fields.push({})} />
    {fields.map((member, index) =>
      <Card key={index}>
        <CardTitle>
          <h5 className={theme.RTCard.title}>
            {`Company Bank Account ${index + 1}`}
            <Button icon="clear" floating accent mini onClick={() => fields.remove(index)} />
          </h5>
        </CardTitle>
        <Row>
          <Col xs={12} sm={6}>
            <Field name={`${member}.id`} type="hidden" disabled={true} component={renderInput} label="ID"/>
          </Col>
          <Col xs={12} sm={6}>
            <Field
              name={`${member}.currency`}
              type="text"
              component={renderDropdown}
              source={constants.lookups.currencies}
              label="currency"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Field
              name={`${member}.accountHolderName`}
              type="text"
              component={renderInput}
              label="Account Holder Name"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <Field name={`${member}.bankAccountNo`} type="text" component={renderInput} label="Bank Account No" />
          </Col>
          <Col xs={12} sm={6}>
            <Field name={`${member}.bankName`} type="text" component={renderInput} label="Bank Name" />
          </Col>
        </Row>
        <FieldArray name={`${member}.files`} component={FileList} />
      </Card>
    )}
  </div>;

export default connect(state => state)(BankAccount);
