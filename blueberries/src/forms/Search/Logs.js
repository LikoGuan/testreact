import React from "react";
import { connect } from 'react-redux';
import { Field, reduxForm } from "redux-form";
import { Row, Col } from "react-flexbox-grid";
import Button from "react-toolbox/lib/button/Button";
import Card from "react-toolbox/lib/card/Card";
import CardTitle from "react-toolbox/lib/card/CardTitle";
import { actions as constantsActions } from '../../redux/ducks/constants';
import { renderInput, renderDatePicker, renderDropdown } from "../Fields";

export const SearchForm = props => {
  const { handleSubmit, submitting, constants } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{ overflow: "initial" }}>
        <CardTitle title="Search" />
        <Row>
          <Col xs={12} sm={4}>
            <Field name="fuzzyString" type="text" component={renderInput} label="Search for Order ID / Wallet ID / User ID" />
          </Col>
          <Col xs={12} sm={4}>
            <Field id="type" name="type" component={renderDropdown} source={constants.enums.ApiLogType} label="Type" />
          </Col>
          <Col xs={12} sm={4}>
            <Field id="status" name="status" component={renderDropdown} source={constants.enums.ApiLogStatusType} label="Status" />
          </Col>

          <Col xs={12} sm={4}>
            <Field name="startTime" component={renderDatePicker} label="Start time" autoOk={true} />
          </Col>
          <Col xs={12} sm={4}>
            <Field name="endTime" component={renderDatePicker} label="End time" autoOk={true} />
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

export default connect(({ constants }) => ({ constants }), constantsActions) (
  reduxForm({
    form: 'search',
  })(SearchForm)
);
