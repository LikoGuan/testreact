import React from 'react';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button/Button';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { renderInput, renderSwitch, renderCheckbox, renderDropdown } from '../Fields';
import { required, number, minValue, maxValue, noProfanity } from '../FieldValidators';
import { connect } from 'react-redux';
import numeral from 'numeral';

const GatewayPricingPlan = props => {
  const { iGateway, initialValues, gatewayPricingPlan, isMerchantPaysMargin } = props;
  console.log(isMerchantPaysMargin);
  return (
    <div>
      <Field
        id="isActive"
        name={`gatewayPricingPlans[${iGateway}].isActive`}
        label={gatewayPricingPlan.paymentType}
        disabled={!initialValues.isMerchantEnabled}
        component={renderCheckbox}
      />
      <Table selectable={false} style={{ margin: 10 }}>
        <TableHead>
          <TableCell>
            <div>Currency</div>
          </TableCell>
          <TableCell>
            <div>FX Rate</div>
          </TableCell>
          <TableCell>
            <div>Margin %</div>
          </TableCell>
          <TableCell>
            <div>Profit Sharing %</div>
          </TableCell>

          <TableCell>
            <div>Comments</div>
          </TableCell>
          <TableCell>
            <div>Type</div>
          </TableCell>
        </TableHead>
        {gatewayPricingPlan.pricingPlans.map((pp, iCurrency) => {
          let isGwActive = gatewayPricingPlan.isActive;
          return (
            <TableRow key={iCurrency}>
              <TableCell>
                <Field
                  name={`gatewayPricingPlans[${iGateway}].pricingPlans[${iCurrency}].merchantCcy`}
                  disabled
                  source={props.constants.lookups.currencies}
                  isUseLabelsAsKeys={true}
                  component={renderDropdown}
                />
              </TableCell>
              <TableCell>
                <Field
                  id="fxRate"
                  disabled={true}
                  name={`gatewayPricingPlans[${iGateway}].pricingPlans[${iCurrency}].fxRate`}
                  format={(value, name) => numeral(value).format('0.0000')}
                  component={renderInput}
                />
              </TableCell>
              <TableCell>
                <Field
                  id="margin"
                  disabled={!initialValues.isMerchantEnabled || !isGwActive}
                  name={`gatewayPricingPlans[${iGateway}].pricingPlans[${iCurrency}].margin`}
                  format={storeValue => {
                    //除掉6位小数后的数
                    let number = Math.floor(numeral(storeValue).multiply(1000000).value());
                    number = numeral(number).divide(1000000);

                    return number.multiply(100).format('0.0000');
                  }}
                  normalize={formValue => numeral(formValue).divide(100).value()}
                  validate={[required, number, minValue(0)]}
                  warn={maxValue(1)}
                  component={renderInput}
                />
              </TableCell>

              <TableCell>
                <Field
                  id="profitSharing"
                  disabled={!initialValues.isMerchantEnabled || !isGwActive || isMerchantPaysMargin}
                  name={`gatewayPricingPlans[${iGateway}].pricingPlans[${iCurrency}].profitSharing`}
                  format={storeValue => numeral(storeValue).multiply(100).format('0.0000')}
                  normalize={formValue => numeral(formValue).divide(100).value()}
                  validate={[required, number, minValue(0)]}
                  warn={maxValue(1)}
                  component={renderInput}
                />
              </TableCell>

              <TableCell>
                <Field
                  id="comments"
                  disabled={!initialValues.isMerchantEnabled || !isGwActive}
                  type="text"
                  validate={[noProfanity]}
                  name={`gatewayPricingPlans[${iGateway}].pricingPlans[${iCurrency}].comments`}
                  component={renderInput}
                />
              </TableCell>
              <TableCell>{pp.payType}</TableCell>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};

let PricingPlanForm = props => {
  const { handleSubmit, submitting, pristine, reset, initialValues, gatewayPricingPlans, isMerchantPaysMargin } = props;
  if (!gatewayPricingPlans) {
    return <div />;
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ margin: 20 }}>
        <CardTitle>Payment Method Margin Control</CardTitle>
        {!initialValues.isMerchantEnabled && (
          <Row>
            <text>Merchant disabled and can't price. System defaults displayed.</text>
          </Row>
        )}
        <Row>
          <Col xs={12} sm={6}>
            <Field
              id="isMerchantPaysMargin"
              name="isMerchantPaysMargin"
              label="Is Merchant Pays Margin"
              disabled={!initialValues.isMerchantEnabled}
              component={renderSwitch}
            />
          </Col>
        </Row>
        {initialValues.gatewayPricingPlans.map((gpp, iGateway) => (
          <Row key={iGateway}>
            <Col>
              <GatewayPricingPlan
                gatewayPricingPlan={gatewayPricingPlans[iGateway]}
                iGateway={iGateway}
                initialValues={initialValues}
                isMerchantPaysMargin={isMerchantPaysMargin}
                constants={props.constants}
                fxRates={props.fxRates}
              />
            </Col>
          </Row>
        ))}
        <Row>
          <Button label="Save" raised disabled={pristine || submitting} type="submit" primary />
          <Button label="Reset" raised disabled={pristine || submitting} type="button" onClick={reset} />
        </Row>
      </Card>
    </form>
  );
};

PricingPlanForm = reduxForm({
  form: 'pricingPlan',
})(PricingPlanForm);

const selector = formValueSelector('pricingPlan'); // <-- same as form name
PricingPlanForm = connect(state => ({
  constants: state.constants,
  gatewayPricingPlans: selector(state, 'gatewayPricingPlans'),
  isMerchantPaysMargin: selector(state, 'isMerchantPaysMargin'),
}))(PricingPlanForm);

export default PricingPlanForm;
