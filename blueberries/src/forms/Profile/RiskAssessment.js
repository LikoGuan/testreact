import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-toolbox/lib/button/Button';
import { Field, reduxForm } from 'redux-form';
import { renderInput, renderDropdown } from '../Fields';
import { Row, Col } from 'react-flexbox-grid';

export function getOptions(data) {
  return (data.map((item) => {
      return { value : item.id,
               label : item.option };
  }));
}

export const RiskAssessmentForm = props => {
  const { handleSubmit, initialValues : { questions }, hideRiskAssessmentModal } = props;
  return (
        <form onSubmit={handleSubmit}>
            <div style={{height:600, overflowY:'auto', overflowX:'hidden'}}>
            <Row>
                {
                    questions.map((q) => {
                        var id = q.id.toString();
                        return (q.questionType === "SELECT" ? 
                                <Col xs={12} sm={12} key={q.id}>
                                    <Field id={id} name={id} component={renderDropdown} source={getOptions(q.options)} label={q.question} />
                                </Col> 
                                :
                                <Col xs={12} sm={12} key={q.id}>
                                    <Field id={id} name={id} type="text" component={renderInput} label={q.question} />
                                </Col>) 
                    })
                }
                <Button label='Save' raised primary type="submit"/>
                <Button label='Cancel' raised onClick={hideRiskAssessmentModal} style={{marginLeft:10}}/>
            </Row>
            </div>
        </form>
  )}

export default connect()(
  reduxForm({
    form: 'RiskAssessment',
  })(RiskAssessmentForm)
);