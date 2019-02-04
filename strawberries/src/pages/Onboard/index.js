import React, {Component} from 'react';
import {connect} from 'react-redux';
import 'url-search-params-polyfill';

import Step1 from './step-1';
import Step2 from './step-2';
import Step3 from './step-3';
import {actions as ossActions} from '../../redux/ducks/ossTemp';

import {messages, locale} from '../../i18n';

import history from '../../history';


const localized = (key, message) => messages[locale][key] || message;

export class Onboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(form) {

    }

    async componentDidMount() {
        this.props.fetchOSS();
    }

    gotoHome = event => {
        event.preventDefault();

        history.replace('/');
        window.location.reload();
    };

    gotoOnboarding = () => {
        this.setState({
            step: 1
        });
    };

    gotoStep = step => () => {
        this.setState({
            step
        });
    };

    render() {
        const queryString = new URLSearchParams(this.props.location.search);
        const source = queryString.get('source');

        const {step} = this.state;
        const {location} = this.props;

        const Form = [
            Step1,
            Step2,
            Step3
        ][step - 1];

        let dom = <p>Not Found</p>;
        if (
            location.pathname === '/onboard' ||
            location.pathname === '/onboard/' ||
            location.pathname === '/join' ||
            location.pathname === '/join/'
        ) {
            dom = (
                <div>
                    {/*<StepHeader step={step} gotoStep={this.gotoStep}/>*/}
                    <Form
                        onSubmit={this.onSubmit}
                        step={step}
                        gotoOnboarding={this.gotoOnboarding}
                        goForward={this.gotoStep(step + 1)}
                        goBack={this.gotoStep(step - 1)}
                        source={source}
                    />
                </div>
            );
        } else if (location.pathname.indexOf('/onboard/success') !== -1) {
            dom = (
                <div style={{width: '80%', margin: '50px auto'}}>
                    <div className="row">
                        <h1 className="col-md-12 text-center">
                            <b>{localized('onboard.success', 'Congratulations!')}</b>
                        </h1>
                    </div>
                    <br/>
                    <p className="text-center onboard-success-lines">
                        {localized('onboard.success.1', 'You are now on-board with Laitpay.')}
                        <br/>
                        {localized('onboard.success.2', 'Our customer service team will contact you shortly.')}
                        <br/>
                        {localized('onboard.success.3', 'For any further assistance please feel free to')}
                    </p>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-4 col-sm-12">
                            <a
                                href="https://www.latipay.net"
                                className="btn btn-primary btn-form onboard-step-button-main"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {localized('contactus', 'CONTACT US')}
                            </a>
                        </div>
                    </div>
                    <p className="text-center">
                        <a className="link" href="/" onClick={this.gotoHome}>
                            {localized('onboard.goto_home', 'Go to Home')}
                        </a>
                    </p>
                </div>
            );
        }

        return (
            <div className="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 onboard-full-container">
                {dom}
            </div>
        );
    }
}

export default connect(state => state, ossActions)(Onboard);
