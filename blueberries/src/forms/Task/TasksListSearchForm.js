import React from "react";
import {Field, reduxForm} from "redux-form";
import {Row, Col} from "react-flexbox-grid";
import Button from "react-toolbox/lib/button/Button";
import Card from "react-toolbox/lib/card/Card";
import {renderDropdown, renderAutoComplete, renderDatePicker} from "../Fields";
import {connect} from 'react-redux';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';

let TasksListSearchForm = props => {
  const {handleSubmit, submitting, constants} = props;
  if (!constants) {
    return (<ProgressBar type="circular" mode="indeterminate"/>);
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{overflow: "visible"}}>
        <Row>
          <Col xs={12} sm={4}>
            <Field name="status" type="text" component={renderAutoComplete} label="Status"
                   source={constants.enums.TaskStatus} multiple={true}/>
          </Col>
          <Col xs={12} sm={4}>
            <Field name="assignedAdminEmail" type="text" component={renderAutoComplete} label="Assigned User"
                   source={constants.lookups.admins} isUseLabelsAsKeys={true}
                   showSelectedWhenNotInSource={true} showSuggestionsWhenValueIsSet={true}
                   multiple={false} isOptional={true}/>
          </Col>
          <Col xs={12} sm={4}>
            <Field name="taskTypeCode" type="text" component={renderDropdown} label="Task Type"
                   source={constants.enums.TaskTypeCode} isOptional={true}/>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={3}>
            <Field name="fromUpdateDt" type="text" component={renderDatePicker} label="From Update Date"
                   multiple={true}/>
          </Col>
          <Col xs={12} sm={3}>
            <Field name="toUpdateDt" type="text" component={renderDatePicker} label="To Update Date"
                   multiple={true}/>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={3}>
            <Button icon="search" label="Search" type="submit" disabled={submitting} raised primary/>
          </Col>
        </Row>
      </Card>
    </form>
  );
};

TasksListSearchForm = reduxForm({
  form: "TaskHistorySearchForm"
})(TasksListSearchForm);
TasksListSearchForm = connect(({constants}) => ({constants}))(TasksListSearchForm);
export default TasksListSearchForm;

/*
          <Col xs={12} sm={3}>
            <Button icon="add" label="New" raised primary onClick={toggleNewTaskModal}/>
          </Col>
 */
