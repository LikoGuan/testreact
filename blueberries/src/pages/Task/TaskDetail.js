import React, { Component } from 'react';
import { Grid } from 'react-flexbox-grid';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Card from 'react-toolbox/lib/card/Card';
import TaskDetailForm from '../../forms/Task/TaskDetailForm';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import ServerException from '../../components/ServerException';
import CardTitle from "react-toolbox/lib/card/CardTitle";
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';
import {formatDate} from '../../util'
import api from '../../api';
import {connect} from 'react-redux';
import moment from 'moment';

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task : undefined,
      taskHistory: [],
      error : undefined,
      isDone : false
    }
  }
  // LIFECYCLE
  componentDidMount() {
    let taskId = this.props.taskId ;
    if (!taskId) {
      console.dir(this.props);
      taskId = this.props.match.params.id ;
    }
    this.getTask(taskId);
    this.getHistory(taskId);
  }
  /*componentWillReceiveProps(nextProps) {
    this.getTask(nextProps.taskId);
    this.getHistory(nextProps.taskId);
  }*/
  onSaveSubmit = form => {
    this.update(form);
  };
  // REST
  async getHistory(id) {
    const resp = await api.task_history.list({taskId:id, pageNo : 0, pageSize : 20});
    if (resp.status===200) {
      this.setState({taskHistory :  resp.data.result , pageNo : 0, total: 1});
    }
  }
  async getTask(id) {
    const resp = await api.task.id(id);
    if (resp.status===200) {
      this.setState({ task :  resp.data });
    }
  }
  toForm(task) {
    let {status,taskType,assignedAdminEmail,description,notes,numberOfTimesIgnored,newStatus,created,updated} = task ;
    return {status,taskType,assignedAdminEmail,description,notes,numberOfTimesIgnored,newStatus,created,updated} ;
  }
  async update(form) {
    let task = Object.assign({},this.state.task ,form);
    task.status = task.newStatus ;
    if (task.newAssignedAdminEmail ) {
      task.assignedAdminEmail = task.newAssignedAdminEmail;
    }
    task.created = moment(task.created).format("YYYY-MM-DD HH:mm:ss");
    task.updated = moment(task.updated).format("YYYY-MM-DD HH:mm:ss");

    const resp = await api.task.update(task.id,task).catch((err)=>{
      this.setState({ error : err });
      return err ;
    });
    if (resp.status===200) {
      this.setState({task: resp.data , isDone : true });
      this.getHistory(task.id);
    }
  }
  resetError() {
    this.setState({error:undefined});
  }
  render() {
    const {taskHistory,task} = this.state ;
    const {newStatus,action,constants} = this.props ;
    if (!(taskHistory && task && constants)) {
      return (<ProgressBar type="circular" mode="indeterminate"/>);
    }
    task.created = new Date(task.created);
    task.updated = new Date(task.updated);
    task.newStatus = newStatus ;
    let header = action ? `${action} task ${task.id}` : `Task ${task.id}`;
    return (
      <div>
      <Grid fluid>
        <CardTitle>{header}</CardTitle>
        <Card>
          <TaskDetailForm onSubmit={this.onSaveSubmit} onClose={this.props.onClose} initialValues={this.toForm(task)} isDone={this.state.isDone}/>
        </Card>
        <CardTitle>History</CardTitle>
        <Card>
          <Table selectable={false} style={{ margin: 10 }}>
            <TableHead>
              <TableCell>Update Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned User</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell># Ignores</TableCell>
            </TableHead>
            {taskHistory.map((item, idx) => {
              const {updated, status, assignedAdminEmail, notes, numberOfTimesIgnored } = item;
              const updateDt = new Date(updated) ;
              return (
                <TableRow key={idx}>
                  <TableCell>{formatDate(updateDt)}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>{assignedAdminEmail}</TableCell>
                  <TableCell>{notes}</TableCell>
                  <TableCell>{numberOfTimesIgnored}</TableCell>
                </TableRow>
              );
            })}
          </Table>
        </Card>
      </Grid>
      <Dialog active={!!this.state.error}>
        {this.state.error &&
        <ServerException error={this.state.error}
                         close={this.resetError.bind(this)}/>}
      </Dialog>
      </div>
    );
  }
}

TaskDetail = connect(
  ({constants}) => ({constants})
)(TaskDetail);
export default TaskDetail;
