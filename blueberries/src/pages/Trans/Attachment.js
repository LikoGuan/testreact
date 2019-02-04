import React, { Component } from 'react';

import { connect } from 'react-redux';
import { reduxForm, FieldArray } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button/Button';

import FileList from '../../forms/Document/FileList';
import { actions as OSSActions } from '../../redux/ducks/oss';

// import { renderInput } from '../../forms/Fields';

class Attachment extends Component {
  
  async componentDidMount() {
    this.props.OSSToFetch();
  }

  render() {
    const {handleSubmit, submitting, pristine } = this.props;

    return (
      <form className="transaction-table--attachment" onSubmit={handleSubmit}>

        <Row end="xs">
          <FieldArray name="attachments" component={FileList} /> 

          <Col>
            <Button label="Save" type="submit" disabled={pristine || submitting} raised primary />
          </Col>
        </Row>
      </form>
    )
  }
}

export default connect(undefined, OSSActions)(
  reduxForm({
    form: 'transaction-detail-form',
  })(Attachment),
);