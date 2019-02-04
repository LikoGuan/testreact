import React from 'react';
import Card from 'react-toolbox/lib/card/Card';
import Button from 'react-toolbox/lib/button/Button';
import {Field,reduxForm} from 'redux-form';
import {renderInput,renderAutoComplete,renderDropdown} from '../Fields';
import {connect} from 'react-redux';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';

let TaskCreateForm = props => {
  const {handleSubmit,pristine,submitting,reset,constants} = props ;
  if (!constants) {
    return (<ProgressBar type="circular" mode="indeterminate"/>);
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card style={{margin : 20}}>
        <Field name="taskTypeId" label="Task Type" component={renderDropdown} source={constants.lookups.taskTypes}/>
        <Field name="assignedAdminEmail" label="Assigned User" component={renderAutoComplete} source={constants.lookups.admins}/>
        <Field name="notes" label="Notes" component={renderInput}/>
        <Field name="status" label="Status" component={renderDropdown} source={constants.enums.TaskStatus} />
      </Card>
      <Button label='Save' raised primary disabled={pristine || submitting} type="submit"/>
      <Button label='Reset' raised disabled={pristine || submitting} type="button" onClick={reset}/>
    </form>
  );
}

TaskCreateForm = reduxForm({
  form: 'task'
})(TaskCreateForm);
TaskCreateForm = connect( ({constants}) => ({constants}) )(TaskCreateForm);
export default TaskCreateForm ;



