import React, { Component } from 'react';
import { FormSection, FieldArray } from 'redux-form';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';

import Address from './Address';
import Person from './Person';

import FileList from './FileList';

class Individual extends Component {
  render() {
    return (
      <Card>
        <CardTitle title="Personal Info" />
        <FormSection name="person">
          <Person />
        </FormSection>
        <FormSection name="address">
          <Address />
        </FormSection>
        <FieldArray name="files" component={FileList} />
      </Card>
    );
  }
}

export default Individual;
