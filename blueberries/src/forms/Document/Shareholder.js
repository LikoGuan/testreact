import React from 'react';
import { Field, FormSection, FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import Button from 'react-toolbox/lib/button/Button';

import { renderInput } from '../Fields';
import Address from './Address';
import Person from './Person';
import FileList from './FileList';
import theme from '../../toolbox/theme';

const Representative = ({ fields, meta: { error, submitFailed } }) =>
  <div>
    <Button icon="add" flat primary label="Add Shareholder" onClick={() => fields.push({})} />
    {fields.map((member, index) =>
      <Card key={index}>
        <CardTitle>
          <h5 className={theme.RTCard.title}>
            {`Company Shareholder ${index + 1}`}
            <Button icon="clear" floating accent mini onClick={() => fields.remove(index)} />
          </h5>
        </CardTitle>

        <Row>
          <Col xs={12} sm={6}>
            <Field name={`${member}.percentage`} type="text" component={renderInput} label="Percentage ownership" />
          </Col>
        </Row>
        <FormSection name={`${member}.person`}>
          <Person />
        </FormSection>
        <FormSection name={`${member}.address`}>
          <Address />
        </FormSection>

        <FieldArray name={`${member}.files`} component={FileList} />
      </Card>
    )}
  </div>;

export default Representative;
