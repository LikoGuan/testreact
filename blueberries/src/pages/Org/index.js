import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Navigation from 'react-toolbox/lib/navigation/Navigation';

import Profile from './Profile';
import Document from './Document';
import PricingPlan from './PricingPlan';
import Transactions from '../Trans';
import Wallets from './Wallets';

import theme from '../../toolbox/theme';

const { raised, primary } = theme.RTButton;
class Organisation extends Component {
  render() {
    const { match } = this.props;
    const { orgId } = match.params;
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
                  to={`${match.url}/profile`}
                >
                  Profile
                </NavLink>
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/documents`}
                >
                  Documents
                </NavLink>
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/pricing`}
                >
                  Pricing
                </NavLink>
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/wallets`}
                >
                  Wallets
                </NavLink>
                <NavLink
                  activeClassName={primary}
                  data-react-toolbox="link"
                  className={`${raised} ${raised}`}
                  to={`${match.url}/transactions`}
                >
                  Wallet Transactions
                </NavLink>
              </Navigation>
            </Col>
          </Row>
        </Grid>
        <Route path={`${match.url}/profile`} render={props => <Profile {...props} orgId={orgId} />} />
        <Route path={`${match.url}/documents`} render={props => <Document {...props} orgId={orgId} />} />
        <Route path={`${match.url}/pricing`} render={props => <PricingPlan {...props} orgId={orgId} />} />
        <Route path={`${match.url}/wallets`} render={props => <Wallets {...props} orgId={orgId} />} />
        <Route path={`${match.url}/transactions`} render={props => <Transactions {...props} orgId={orgId} />} />
      </div>
    );
  }
}
export default Organisation;
