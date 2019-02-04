import React from 'react';
import { FormSection, FieldArray } from 'redux-form';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import Button from 'react-toolbox/lib/button/Button';

import Address from './Address';
import Person from './Person';
import FileList from './FileList';
import theme from '../../toolbox/theme';

const Representative = ({ fields, meta: { error, submitFailed } }) =>
  <div>
    <Button icon="add" flat primary label="Add Representative" onClick={() => fields.push({})} />
    {fields.map((member, index) =>
      <Card key={index}>
        <CardTitle>
          <h5 className={theme.RTCard.title}>
            {`Company Representative ${index + 1}`}
            <Button icon="clear" floating accent mini onClick={() => fields.remove(index)} />
          </h5>
        </CardTitle>

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
