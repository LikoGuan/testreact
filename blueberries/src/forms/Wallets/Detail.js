import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-toolbox/lib/button/Button';
import { Field, reduxForm } from 'redux-form';
import { renderInput } from '../Fields';
import { Row, Col } from 'react-flexbox-grid';

export const DetailForm = props => {
  const { handleSubmit, hideModal } = props;
  return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Col xs={12} sm={12}>
                    <Field id="subMchId" name="subMchId" type="text" component={renderInput} label="Wechat Secondary ID" />
                </Col> 
                <Col xs={12} sm={12}>
                    <Field id="mccCode" name="mccCode" type="text" component={renderInput} label="Aipay MCC Code" />
                </Col> 
                <Button label='Save' raised primary type="submit"/>
                <Button label='Cancel' raised onClick={hideModal} style={{marginLeft:10}}/>
            </Row>
        </form>
  )}

export default connect()(
  reduxForm({
    form: 'Detail',
  })(DetailForm)
);