import React, { Component } from 'react';
import { Route, NavLink, Redirect, Switch } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Navigation from 'react-toolbox/lib/navigation/Navigation';

import Pending from './Pending';
import History from './History';
import BankList from './BankList';
import BankFile from './BankFile';
import theme from '../../toolbox/theme';

const { raised, primary } = theme.RTButton;

class Settlements extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row around="xs">
            <Col xs={12} sm={10}>
              <Navigation type="horizontal">
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/pending`}
                >
                  Pending
                </NavLink>
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/history`}
                >
                  History
                </NavLink>
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/banklist`}
                >
                  Bank list
                </NavLink>
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/bankfile`}
                >
                  Bank File
                </NavLink>
              </Navigation>
            </Col>
          </Row>
        </Grid>
        <Switch>
          <Route path={`${match.url}/pending`} render={props => <Pending {...props} />} />
          <Route path={`${match.url}/history`} render={props => <History {...props} />} />
          <Route path={`${match.url}/banklist`} render={props => <BankList {...props} />} />
          <Route path={`${match.url}/bankfile`} render={props => <BankFile {...props} />} />

          <Redirect to={`${match.url}/pending`} />
        </Switch>
      </div>
    );
  }
}
export default Settlements;
