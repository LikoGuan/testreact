import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-toolbox/lib/button/Button';
import { Field, reduxForm } from 'redux-form';
import { renderInput, renderDropdown, renderDatePicker } from '../Fields';
import { Row, Col } from 'react-flexbox-grid';
import Card from 'react-toolbox/lib/card/Card';
import { actions as constantsActions } from '../../redux/ducks/constants';

export const SearchForm = props => {
  const { handleSubmit, submitting, constants } = props;
  const dateTypes = [{ value: 'onboarding', label: 'Onboarding Date'}, 
                     { value: 'verification', label: 'Verification Date'}]
  return (
    <form onSubmit={handleSubmit}>
        <Card style={{marginBottom: 20}}>
            <Row>
                <Col sm={4}>
                    <Field id="fuzzyString" name="fuzzyString" type="text" component={renderInput} label="Search for organisation id / name / email"/>
                </Col>
                
                <Col sm={2}>
                    <Field id="merchantType" name="merchantType" component={renderDropdown} source={constants.enums.MerchantType} label="Merchant Type" />
                </Col>
                <Col sm={2}>
                    <Field id="status" name="status" component={renderDropdown} source={constants.enums.VerificationStatusType} label="Status" />
                </Col>
                <Col sm={2}>
                    <Field id="riskLevel" name="riskLevel" component={renderDropdown} source={constants.enums.RiskLevelType} label="Risk Level"/>
                </Col>
            </Row>
            <Row>
                <Col sm={3}>
                    <Field id="dateType" name="dateType" component={renderDropdown} source={dateTypes} label="Date Type" />
                </Col>
                <Col sm={2}>
                    <Field id="startTime" name="startTime" component={renderDatePicker} label="Start Date" autoOk={true} />
                </Col>
                <Col sm={2}>
                    <Field id="endTime" name="endTime" component={renderDatePicker} label="End Date" autoOk={true} />
                </Col>
            </Row>
            <Row end="xs">
                <Col xs={6}>
                    <Button icon="search" label="Search" raised primary type="submit" disabled={submitting} />
                </Col>
            </Row>
        </Card>
    </form>
    );
}

export default connect(({ constants }) => ({ constants }), constantsActions) (
  reduxForm({
    form: 'search',
  })(SearchForm)
);