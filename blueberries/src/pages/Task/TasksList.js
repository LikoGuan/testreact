import React, { Component } from 'react';
import {Grid} from 'react-flexbox-grid';
import Table from 'react-toolbox/lib/table/Table';
import TableHead from 'react-toolbox/lib/table/TableHead';
import TableRow from 'react-toolbox/lib/table/TableRow';
import TableCell from 'react-toolbox/lib/table/TableCell';
import Dialog from 'react-toolbox/lib/dialog/Dialog';
import {connect} from 'react-redux';
import CardTitle from "react-toolbox/lib/card/CardTitle";
import Pagination from '../../components/Pagination';
import Button from 'react-toolbox/lib/button/Button';
import TaskDetail from './TaskDetail';
import TasksListSearchForm from '../../forms/Task/TasksListSearchForm';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';
import { NavLink } from 'react-router-dom';
import api from '../../api';
import {getLabel} from '../../util'
import moment from 'moment'

class TasksList extends Component {
  constructor(props) {
    super(props);
    const getAdmin = () => {
      const params = new URLSearchParams(props.location.search);
      return params.get("assignedUserEmail") || this.props.auth.userId ;
    };
    const getStatus = () => {
      const params = new URLSearchParams(props.location.search);
      const statusParam = params.get("status");
      if (!statusParam) {
        return  [] ;
      } else {
        return statusParam.split(",");
      }
    };

    this.state = {
      task : null,
      tasks:[] ,
      searchForm : {
        status:getStatus(),
        assignedAdminEmail:getAdmin(),
        taskTypeCode:undefined,
        fromUpdateDt:undefined,
        toUpdateDt:undefined
      },
      pageNo: 0, pageSize:10, totalNum:10,
      isDetailModal:false,
      detailTaskId:undefined
    };
    this.onPageChange = this.onPageChange.bind(this)
    this.getList  = this.getList.bind(this)
  }
  // LIFECYCLE
  componentDidMount() {
    this.getList(this.state.searchForm);
  }
  // NAVIGATION
  onPageChange(pageNo) {
    this.setState({pageNo},this.getList);
  }
  toggleModal = () => {
    this.setState({ isModal: !this.state.isModal });
  };
  toggleDetailModal = (newStatus,action,detailTaskId) => {
    if (this.state.isDetailModal) {
      this.setState({
        isDetailModal: false
      });
      this.getList(this.state.searchForm);
    } else {
      this.setState({
        isDetailModal: true,
        detailTaskId : detailTaskId,
        newStatus : newStatus,
        action : action
      });
    }
  };
  // REST
  async getList(search) {
    this.setState({search});
    let searchForm = {
      ...search,
      status:(search.status && search.status.length>0) ? search.status.join(",") : undefined,
      assignedAdminEmail:search.assignedAdminEmail==="Any"?undefined:search.assignedAdminEmail,
      taskTypeCode: search.taskTypeCode
    };
    if (searchForm.fromUpdateDt) {
      searchForm.fromUpdateDt = moment(searchForm.fromUpdateDt).format("YYYY-MM-DD") ;
    }
    if (searchForm.toUpdateDt) {
      searchForm.toUpdateDt = moment(searchForm.toUpdateDt).format("YYYY-MM-DD") ;;
    }
    if (searchForm.taskTypeCode==="NULL") {
      delete searchForm.taskTypeCode ;
    }
    const resp = await api.task.list({
      ...searchForm,
      pageNo:this.state.pageNo ,
      pageSize:this.state.pageSize
    });
    if (resp.status===200) {
      this.setState({
        tasks :  resp.data.result ,
        totalNum : resp.data.totalNum
      });
    }
  }
  async create(task) {
    const resp = await api.task.create(task);
    if (resp.status===200) {
      this.setState({ task :  resp.data });
    }
  };
  render() {
    const {tasks} = this.state ;
    const {constants,auth} = this.props ;
    console.dir(auth);    
    if (!(constants && constants.isLoaded))  {
      return (<ProgressBar type="circular" mode="indeterminate"/>);
    }
    return (
      <Grid>
          <CardTitle>Tasks List</CardTitle>
          <TasksListSearchForm
            initialValues={this.state.searchForm}
            toggleNewTaskModal={this.toggleModal}
            onSubmit={this.getList}
          />
          <Table selectable={false} style={{margin:10}}>
            <TableHead>
              <TableCell>Task Id</TableCell>
              <TableCell>Update Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Task Type</TableCell>
              <TableCell>Assigned User</TableCell>
              <TableCell>Description</TableCell>
              <TableCell># Ignores</TableCell>
            </TableHead>
            {tasks.map((item, idx) => {
              const {id,updated,status,taskType,assignedAdminEmail,description,numberOfTimesIgnored } = item;
              const isMyTask = auth.userId === assignedAdminEmail ;
              return (
                <TableRow key={idx}>
                  <TableCell><NavLink activeClassName="selected" to={`/task/${id}`}>{id}</NavLink></TableCell>
                  <TableCell>{updated}</TableCell>
                  <TableCell>{getLabel(constants.enums.TaskStatus,status)}</TableCell>
                  <TableCell>{getLabel(constants.enums.TaskTypeCode,taskType)}</TableCell>
                  <TableCell>{assignedAdminEmail}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{numberOfTimesIgnored}</TableCell>
                  <TableCell>
                    <Button label="Assign" raised primary 
                            disabled={status!=="CREATED" && (!isMyTask  || status==="COMPLETED")}
                            onClick={this.toggleDetailModal.bind(this,"ASSIGNED","Assign",id)}/>
                  </TableCell>
                  <TableCell>
                    <Button label="Ignore" raised primary 
                            disabled={!isMyTask  || status==="COMPLETED" || (constants.appProps && numberOfTimesIgnored>constants.appProps.tasksMaxIgnores)}
                            onClick={this.toggleDetailModal.bind(this,"IGNORED","Ignore",id)}/>
                  </TableCell>
                  <TableCell>
                    <Button label="Complete" raised primary 
                            disabled={!isMyTask  || status==="COMPLETED"}
                            onClick={this.toggleDetailModal.bind(this,"COMPLETED","Complete",id)}/>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
          <div>
            <Pagination total={this.state.totalNum} current={this.state.pageNo} size={this.state.pageSize}
                        onPageChange={this.onPageChange} />
          </div>
        <Dialog
          active={this.state.isDetailModal}
          onEscKeyDown={this.toggleDetailModal}
          onOverlayClick={this.toggleDetailModal}>
          <TaskDetail
            taskId={this.state.detailTaskId}
            newStatus={this.state.newStatus}
            action={this.state.action}
            onSubmit={this.create}
            onClose={this.toggleDetailModal.bind(this)}
          />
        </Dialog>

      </Grid>
    );
  }
}

export default connect(
  ({auth,constants}) => ({auth,constants})
)(TasksList);

/*


 status:undefined,
 assignedAdminEmail:undefined,
 created:new Date(),
 taskTypeId:this.state.search.taskTypeCode


 <Dialog
 active={this.state.isModal}
 onEscKeyDown={this.toggleModal}
 onOverlayClick={this.toggleModal}
 title="New Task">
 <TaskCreateForm
 initialValues={{
 status:undefined,
 assignedAdminEmail:undefined,
 created:new Date(),
 taskTypeId:this.state.search.taskTypeCode
 }}
 onSubmit={this.create}
 />
 </Dialog>

 */
