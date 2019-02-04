import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-toolbox/lib/button/Button';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { renderInput, renderAutoComplete, renderSwitch, renderDropdown, renderDatePicker } from '../Fields';
import { Row, Col } from 'react-flexbox-grid';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import { formatDate } from '../../util';

export function displayRiskLevel(riskLevel) {
  var color;
  switch (riskLevel) {
    case 'VERY_LOW':
      color = '#B2FF59';
      break;
    case 'LOW':
      color = '#FFEB3B';
      break;
    case 'MEDIUM':
      color = '#FFCA28';
      break;
    case 'HIGH':
      color = '#FF9800';
      break;
    case 'VERY_HIGH':
      color = '#F44336';
      break;
    default:
      color = '#FFFFFF';
  }
  return <span style={{ backgroundColor: color, padding: 5 }}>{riskLevel}</span>;
}

export const ProfileForm = props => {
  const { initialValues: { riskLevelType, created, updated }, isCompanyForm, isUpdate, handleSubmit, submitting, constants, showRiskAssessmentModal } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ overflow: 'visible', marginBottom: 20 }}>
        <CardTitle title={isCompanyForm ? 'Company Details' : 'Personal Details'} />
        <Row>
          <Col xs={12} sm={6}>
            <Field id="id" name="id" type="text" component={renderInput} label="Merchant ID" disabled={true} />
          </Col>
          <Col xs={12} sm={6}>
            <Field
              id="merchantType"
              name="merchantType"
              type="text"
              component={renderDropdown}
              source={constants.enums.MerchantType}
              label="Merchant Type"
              disabled={isUpdate}
            />
          </Col>

          <Col xs={12} sm={6}>
            <Field
              id="primaryCurrencyId"
              name="primaryCurrencyId"
              type="text"
              component={renderDropdown}
              source={constants.lookups.currencies}
              label="Primary Currency"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Field
              id="contactLanguage"
              name="contactLanguage"
              component={renderAutoComplete}
              label="Contact Language"
              source={constants.lookups.languages}
              isUseLabelsAsKeys={true}
            />
          </Col>

          <Col xs={12} sm={6}>
            {isCompanyForm ? (
              <Field id="registeredCompanyName" name="registeredCompanyName" component={renderInput} label="Registered Company Name" disabled={isUpdate} />
            ) : (
              <Field id="contactName" name="contactName" component={renderInput} label="Legal Name" disabled={isUpdate} />
            )}
          </Col>

          <Col xs={12} sm={6}>
            {isCompanyForm ? (
              <Field id="companyNumber" name="companyNumber" component={renderInput} label="Company Number" disabled={isUpdate} />
            ) : (
              <Field id="contactEnglishName" name="contactEnglishName" component={renderInput} label="English Name" />
            )}
          </Col>

          {isCompanyForm ? (
            <Col xs={12} sm={6}>
              <Field id="tradeName" name="tradeName" component={renderInput} label="Business Name" />
            </Col>
          ) : null}

          <Col xs={12} sm={6}>
            {isCompanyForm ? (
              <Field
                id="incorporatedDate"
                name="incorporatedDate"
                component={isUpdate ? renderInput : renderDatePicker}
                label="Incorporated Date"
                disabled={isUpdate}
              />
            ) : (
              <Field
                id="nationality"
                name="nationality"
                component={renderAutoComplete}
                label="Nationality"
                source={constants.lookups.countries}
                isUseLabelsAsKeys={true}
              />
            )}
          </Col>

          <Col xs={12} sm={6}>
            {isCompanyForm ? (
              <Field id="natureOfBusiness" name="natureOfBusiness" component={renderInput} label="Nature of Business" />
            ) : (
              <Field id="contactPhone" name="contactPhone" component={renderInput} label="Contact Phone" />
            )}
          </Col>

          {!isCompanyForm ? (
            <Col xs={12} sm={6}>
              <Field id="contactEmail" name="contactEmail" component={renderInput} label="Email" />
            </Col>
          ) : null}
          {!isCompanyForm ? (
            <Col xs={12} sm={6}>
              <Field id="wechat" name="wechat" component={renderInput} label="WeChat" />
            </Col>
          ) : null}
        </Row>
        <Row>
          <Col xs={12} sm={6}>
            <Field id="addressStreet" name="addressStreet" component={renderInput} label="Address Line 1" />
            <Field id="addressSuburb" name="addressSuburb" component={renderInput} label="Address Line 2" />
            <Field id="addressCity" name="addressCity" component={renderInput} label="City" />
            <Field id="addressPostcode" name="addressPostcode" component={renderInput} label="Post Code" />
            <Field
              id="addressCountry"
              name="addressCountry"
              component={renderAutoComplete}
              label="Country"
              source={constants.lookups.countries}
              isUseLabelsAsKeys={true}
            />
          </Col>
        </Row>
      </Card>

      {isCompanyForm ? (
        <Card style={{ overflow: 'visible', marginBottom: 20 }}>
          <CardTitle title="Key Contact Person" />
          <Row>
            <Col xs={12} sm={6}>
              <Field id="contactName" name="contactName" component={renderInput} label="Legal Name" />
              <Field
                id="nationality"
                name="nationality"
                component={renderAutoComplete}
                label="Nationality"
                source={constants.lookups.countries}
                isUseLabelsAsKeys={true}
              />
              <Field id="contactEmail" name="contactEmail" component={renderInput} label="Email" />
              <Field id="contactPhone" name="contactPhone" component={renderInput} label="Contact Phone" />
            </Col>
          </Row>
        </Card>
      ) : (
        <Card style={{ marginBottom: 20 }}>
          <CardTitle title="Business Details (Optional)" />
          <Row>
            <Col xs={12} sm={6}>
              <Field id="tradeName" name="tradeName" component={renderInput} label="Business Name" />
              <Field id="website" name="website" component={renderInput} label="Business Website" />
            </Col>
          </Row>
        </Card>
      )}
      <Card style={{ marginBottom: 20 }}>
        <CardTitle title="Compliance Check" />
        <Row>
          <Col xs={12} sm={6}>
            <Field
              id="regulatedBusiness"
              name="regulatedBusiness"
              component={renderSwitch}
              label="Is your business supervised/registred for Anti-Money compliance"
            />
          </Col>
          <Col xs={12} sm={6}>
            <Field id="reviewInvoice" name="reviewInvoice" component={renderSwitch} label="Review Invoice Control" />
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ marginBottom: 20 }}>
              <p>Risk Assessment: {displayRiskLevel(riskLevelType)}</p>
            </div>
            <Button label={riskLevelType !== null ? 'EDIT' : 'START'} raised primary onClick={showRiskAssessmentModal} />
          </Col>
          <Col xs={12} sm={6} />
          <Col xs={12} sm={6}>
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <p>Last sanction</p>
              <span>{formatDate(created)}</span>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ marginTop: 20 }}>
              <p>Last Checked</p>
              <span>{formatDate(updated)}</span>
            </div>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginBottom: 20 }}>
        <CardTitle title="General Development" />
        <Row>
          <Col xs={12} sm={6}>
            <Field id="salesPerson" name="salesPerson" component={renderInput} label="Person Sales" />
          </Col>
          <Col xs={12} sm={6}>
            <Field id="salesPersonComment" name="salesPersonComment" component={renderInput} label="Comment" />
          </Col>
          <Col xs={12} sm={6}>
            <Field id="accountManager" name="accountManager" component={renderInput} label="Account Manager" />
          </Col>
          <Col xs={12} sm={6}>
            <Field id="accountManagerComment" name="accountManagerComment" component={renderInput} label="Comment" />
          </Col>
        </Row>
      </Card>
      <Button label="Save" raised primary type="submit" disabled={submitting} />
    </form>
  );
};

const selector = formValueSelector('Profile');
export default connect(state => ({
  isCompanyForm: selector(state, 'merchantType') === 'COMPANY',
}))(
  reduxForm({
    form: 'Profile',
  })(ProfileForm)
);
