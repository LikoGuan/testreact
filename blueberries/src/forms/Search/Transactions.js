import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'react-toolbox/lib/button/Button';
import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';

import { renderInput, renderDatePicker, renderAutoComplete, renderDropdown} from '../Fields';
import { actions as constantsActions } from '../../redux/ducks/constants';

export const SearchForm = props => {
  const { handleSubmit, submitting, wallets = [], orgId, constants } = props;
  const { TransactionTypeEnum } = constants.enums;
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ overflow: 'initial' }}>
        <CardTitle title="Search" />
        <Row>
          <Col xs={12} sm={4}>
            <Field name="fuzzyString" type="text" component={renderInput} label="Search" />
          </Col>
          {orgId &&
            <Col xs={12} sm={4}>
              <Field
                name="accountCode"
                source={wallets.reduce((obj, wallet) => {
                  obj[wallet.accountCode] = wallet.accountName;
                  return obj;
                }, {})}
                multiple={true}
                component={renderAutoComplete}
                label="Wallet"
              />
            </Col>}
          <Col xs={12} sm={4}>
            <Field name="startTime" component={renderDatePicker} label="Start time" autoOk={true} />
          </Col>
          <Col xs={12} sm={4}>
            <Field name="endTime" component={renderDatePicker} label="End time" autoOk={true} />
          </Col>
          <Col xs={12} sm={4}>
            <Field
              name="type"
              source={TransactionTypeEnum}
              multiple={true}
              component={renderAutoComplete}
              label="Type"
            />
          </Col>
          <Col xs={12} sm={4}>
            <Field
              name="currency"
              source={{ NZD: 'NZD', AUD: 'AUD', USD: 'USD' }}
              multiple={true}
              component={renderAutoComplete}
              label="Currency"
            />
          </Col>
          <Col xs={12} sm={4}>
            <Field
              name="paymentMethod"
              source={{ wechat: 'Wechat', alipay: 'Alipay', jdpay: 'JDPay', onlineBank: 'Online Bank' }}
              multiple={true}
              component={renderAutoComplete}
              label="Payment Method"
            />
          </Col>

          <Col xs={12} sm={4}>
            <Field 
              name="status"
              component={renderDropdown} 
              source={[{value: '', label: 'All'}, {value: 'pending', label: 'Pending'}, {value: 'locked', label: 'Locked'}, {value:'success', label:'Completed'}]} 
              label="Status" 
            />
          </Col>
          <Col xs={12} sm={4}>
            <Field 
              name="verifyStatus" 
              component={renderDropdown} 
              source={[{value: '', label: 'All'}, {value: 'pending', label: 'Pending'}, {value:'completed', label:'Completed'}]} 
              label="Verify status" 
            />
          </Col>
        </Row>
        <Row end="xs">
          <Col>
            <Button icon="search" label="Search" type="submit" disabled={submitting} raised primary />
          </Col>
        </Row>
      </Card>
    </form>
  );
};

export default connect(({ constants }) => ({ constants }), constantsActions)(
  reduxForm({
    form: 'search',
  })(SearchForm)
);
