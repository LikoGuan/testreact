import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../components/Header/';
import Barcode from './Barcode/';
import Spotpay from './Spotpay/';
import SupportbyFooter from '../components/SupportbyFooter';
import { isMobile, isiOS } from '../utils';
import Merchant from './Merchant';
import { showBarcode } from '../constants';

const Home = ({ isPC }) => {
  return <Redirect to={isPC ? '/barcode' : '/spotpay'} />;
};

class Main extends Component {
  render() {
    const { org_id } = this.props;

    if (!org_id) {
      return <div />;
    }

    const isPC = !isMobile() && !isiOS();
    return (
      <div className="main">
        <div>
          <Header {...this.props} isPC={isPC} />

          <div className="main-container">
            <Switch>
              <Route exact path="/" render={isPC => <Home isPC={isPC} />} />

              {isPC &&
                showBarcode(org_id) && (
                  <Route path="/barcode" component={Barcode} />
                )}
              <Route path="/spotpay" component={Spotpay} />
              <Route path="/merchant" component={Merchant} />
              <Route component={Home} />
            </Switch>
          </div>
        </div>

        <SupportbyFooter />
      </div>
    );
  }
}

export default connect(({ data: { profile: { org_id } } }) => ({ org_id }))(
  Main
);
