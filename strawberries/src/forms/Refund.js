import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import numeral from 'numeral';

import * as formValidations from './formValidations';
import { renderInput } from './Fields';
import { CURRENCIES_CODE_SIGN } from '../constants';

const validators = formValidations.createValidator({
  refundAmount: [formValidations.required, formValidations.greaterThan(0)],
  reference: [formValidations.required, formValidations.maxLength(50)]
});

class RefundForm extends Component {
  // constructor(props) {
  // super(props);

  // this.state = { amountRefundable: -1 };

  // this.componentDidMount = this.componentDidMount.bind(this);
  // }
  //
  // async componentDidMount() {
  //   const { orderId, change } = this.props;
  //
  //   const { data } = await api.transactions.id(orderId); //TODO Detail存在重复请求
  //   if (data.code === 0) {
  //     const amountRefundable = data.refundAmount;
  //     this.setState({
  //       amountRefundable
  //     });
  //
  //     change('refundAmount', amountRefundable);
  //   }
  // }

  onSubmit = form => {
    const { refundAmount } = form;
    const { maxRefundAmount } = this.props;

    if (refundAmount > maxRefundAmount) {
      alert(`The max amount is ${numeral(maxRefundAmount).format('0,0.00')}`);
    } else {
      this.props.handleSubmit();
    }
  };

  render() {
    const {
      submitting,
      handleSubmit,
      refundAmount,
      maxRefundAmount,
      payCurrency,
    } = this.props;
    const amountSign = CURRENCIES_CODE_SIGN[payCurrency];

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          id="amount"
          name="refundAmount"
          type="number"
          step="any"
          max={maxRefundAmount}
          component={renderInput}
          label={`Refund Amount. (maximum ${amountSign} ${numeral(
            maxRefundAmount
          ).format('0,0.00')} ${payCurrency})`}
        />
        <Field
          id="reference"
          name="reference"
          type="text"
          component={renderInput}
          label="Reference"
          maxLength="50"
        />
        <button
          type="submit"
          className="btn btn-primary "
          disabled={submitting || refundAmount > maxRefundAmount}
        >
          Submit
        </button>
      </form>
    );
  }
}

const selector = formValueSelector('refund');
export default connect(state => ({
  refundAmount: selector(state, 'refundAmount')
}))(
  reduxForm({
    form: 'refund',
    validate: validators
  })(RefundForm)
);
