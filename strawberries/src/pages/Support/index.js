import React, { Component } from 'react';

import Header from './Header';
import Footer from './Footer';
import Step from './components/Step';

import Transaction from './components/Transaction';
import Status from './components/Status';
import Refund from './components/Refund';
import Settlement from './components/Settlement';
import Account from './components/Account';

import './index.css';

export class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      product: 'spotpay',
      statusIn: 'app',
      refundIn: 'app',
      settleIn: 'app',
      withdraw: 'manu',
      accountHow: 'Change password'
    };
  }
  search = e => {};

  changeState = state => () => {
    this.setState({
      ...state
    });
  };

  page = () => {
    const {
      step,
      product,
      statusIn,
      refundIn,
      settleIn,
      withdraw,
      accountHow
    } = this.state;

    switch (step) {
      case 0:
        return <Transaction product={product} changeState={this.changeState} />;
      case 1:
        return <Status statusIn={statusIn} changeState={this.changeState} />;
      case 2:
        return <Refund refundIn={refundIn} changeState={this.changeState} />;
      case 3:
        return (
          <Settlement
            settleIn={settleIn}
            withdraw={withdraw}
            changeState={this.changeState}
          />
        );
      case 4:
        return (
          <Account accountHow={accountHow} changeState={this.changeState} />
        );
      default:
    }

    return null;
  };

  onBack = () => {
    this.setState(nextState => {
      return {
        step: nextState.step - 1
        // product: 'spotpay',
        // statusIn: 'app',
        // refundIn: 'app',
        // settleIn: 'app',
        // withdraw: 'manu'
      };
    });
  };

  onNext = () => {
    this.setState(nextState => {
      return {
        step: nextState.step + 1
        // product: 'spotpay',
        // statusIn: 'app',
        // refundIn: 'app',
        // settleIn: 'app',
        // withdraw: 'manu'
      };
    });
  };
  render() {
    const { step } = this.state;

    return (
      <div className="sp">
        <Header header={{ lite: false }} />

        <div className="sp-body">
          <Step step={step} changeState={this.changeState} />

          {this.page()}

          {step > 0 && (
            <a className="sp-btn--fillblue" onClick={this.onBack}>
              BACK
            </a>
          )}
          {step < 4 && (
            <a className="sp-btn--fillgreen" onClick={this.onNext}>
              NEXT
            </a>
          )}
        </div>

        <Footer mode="light" />
      </div>
    );
  }
}

export default Page;
