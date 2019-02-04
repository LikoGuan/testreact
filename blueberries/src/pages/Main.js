import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Appbar from '../components/Appbar';
import Orgs from './Orgs';
import Org from './Org';
import TaskList from './Task/TasksList';
import TaskDetail from './Task/TaskDetail';
import Logs from './Logs';
import Transactions from './Trans';
import PricingPlan from './Org/PricingPlan';
import Settlements from './Settlements';

class Main extends Component {
  render() {
    return (
      <div>
        <Route component={Appbar} />
        <Switch>
          <Route path="/orgs" component={Orgs} />
          <Route path="/org/:orgId" component={Org} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/pricing" component={PricingPlan} />
          <Route path="/tasks" component={TaskList} />
          <Route path="/task/:id" component={TaskDetail} />
          <Route path="/logs" component={Logs} />
          <Route path="/settlements" component={Settlements} />

          <Redirect to="/orgs" />
        </Switch>
      </div>
    );
  }
}
export default Main;
