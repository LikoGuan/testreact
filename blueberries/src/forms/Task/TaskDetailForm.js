import React from 'react';
import {Field,reduxForm} from 'redux-form';
import { Row, Col } from "react-flexbox-grid";
import {renderInput, renderDropdown} from '../Fields';
import {connect} from 'react-redux';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';
import {formatDate} from '../../util'

let TaskDetailForm = props => {
  const {handleSubmit,constants,initialValues} = props ;
  if (!constants) {
    return (<ProgressBar type="circular" mode="indeterminate"/>);
  }
  initialValues.createDt = formatDate(initialValues.created) ;
  return (
    <form onSubmit={handleSubmit}>
      
        {/*
        <Row>
          <Col xs={12} sm={3}>
            <Field name="newStatus" label="New Status" component={renderDropdown} source={constants.enums.TaskStatus} disabled={true}/>
          </Col>
          {initialValues.newStatus==="ASSIGNED" &&
          <Col xs={12} sm={3}>
            <Field name="newAssignedAdminEmail" label="New Assigned User" component={renderAutoComplete} source={constants.lookups.admins}
                   isUseLabelsAsKeys={true} showSelectedWhenNotInSource={true} showSuggestionsWhenValueIsSet={true}/>
          </Col>}
          {initialValues.newStatus==="IGNORED" &&
          <Col xs={12} sm={3}>
            <Field name="numberOfTimesIgnored" label="Number of ignores" component={renderInput} type="number" disabled={true}/>
          </Col>}
          <Col xs={12} sm={3}>
            {props.isDone ?
              <Button label='DONE!' raised primary disabled={true}/> :
              <Button label='OK' raised primary disabled={(initialValues.newStatus==="ASSIGNED"&&pristine) || submitting} type="submit"/>}
          </Col>
          <Col xs={12} sm={3}>
            <Button label='CLOSE' raised primary disabled={(initialValues.newStatus==="ASSIGNED"&&pristine) || submitting} onClick={onClose}/>
          </Col>
        </Row>
        */}
        <Row>
          <Col xs={12} sm={3}>
            <Field name="status" label="Current Status" component={renderDropdown} source={constants.enums.TaskStatus} disabled={true}/>
          </Col>
          <Col xs={12} sm={3}>
            <Field name="createDt" label="Created" component={renderInput} disabled/>
          </Col>
          <Col xs={12} sm={3}>
            <Field name="taskType" label="Task Type" component={renderDropdown} source={constants.enums.TaskTypeCode} disabled/>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={3}>
            <Field name="assignedAdminEmail" label="Assigned User" component={renderInput} disabled/>
          </Col>
          <Col xs={12} sm={9}>
            <Field name="description" label="Description" component={renderInput} disabled/>
          </Col>
        </Row>
      
    </form>
  );
}

TaskDetailForm = reduxForm({
  form: 'task'
})(TaskDetailForm);
TaskDetailForm = connect( ({constants}) => ({constants}) )(TaskDetailForm);
export default TaskDetailForm ;



