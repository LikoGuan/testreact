import React from 'react';
import 'url-search-params-polyfill';

// import { Link } from 'react-router-dom';
import {Dropdown, MenuItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import Logo from './Logo';
import Nav from './Nav';
import Burger from './Burger';
// import api from '../api';
import {CustomToggle} from '../components/DropdownToggle';
// import { ONBOARD_STEP } from '../constants';
import {messages, locale} from '../i18n';
import CustomLogo from './CustomLogo';

const localized = (key, message) => messages[locale][key] || message;

export default class Header extends React.Component {
    // constructor(props) {
    //   super(props);

    //   this.state = {
    //     onboard: {
    //       step: -1,
    //       totalAmount: 0,
    //     }
    //   };
    // }

    //onboard
    // async componentDidMount(){
    //   const pathname = this.props.location.pathname;
    //   if (pathname !== '/') return;

    //   const { data } = await api.onboard.get();
    //   if (data.code === 0) {
    //     const onboard = {
    //       step: data.step,
    //     };

    //     const { data: data1 } = await api.onboard.getAmount();
    //     if (data1.code === 0) {
    //       onboard.totalAmount = data1.totalAmount;
    //       this.setState({
    //         onboard
    //       });
    //     }
    //   }
    // }

    getSourceLogo(src, to) {
        if (src) {
            const sourceArray = [
                'nztg'
            ];

            if (sourceArray.indexOf(src.toLowerCase()) > -1) {
                return (
                    <CustomLogo to={this.getSourceUrl(src.toLocaleString())} source={src.toLowerCase()}/>
                );
            }
        }
    }

    getSourceUrl(src) {
        if (src === 'nztg') {
            return 'https://www.tourism.net.nz';
        }
        return '';
    }

    render() {
        // const { header: {lite, contactUs}, location: { pathname } } = this.props;
        const {header: {lite, contactUs, support}} = this.props;
        const queryString = new URLSearchParams(this.props.location.search);
        const source = queryString.get('source');
        // const { step, totalAmount } = this.state.onboard;
        // const needTrial = pathname === '/' && step === ONBOARD_STEP.NONE && totalAmount === 0;
        // const trialTips = pathname === '/' && step === ONBOARD_STEP.TRIAL_PENDING;
        // const needFull = pathname === '/' && step === ONBOARD_STEP.TRIAL_PASS && totalAmount > 500;
        // const fullTips = pathname === '/' && step === ONBOARD_STEP.FULL_PENDING;

        //<div className={needTrial || trialTips || needFull || fullTips ? "lat-header lat-header-onboard" : "lat-header"}>
        return (
            <div className="lat-header">
                <div className="container ">
                    <div className="row">
                        <div className="col-md-12">
                            <div className={lite ? '' : 'lat-header-container'}>
                                {lite ? null : <Burger/>}
                                <Logo to="/"/>
                                {this.getSourceLogo(source, "/")}
                                {lite ? null : <Nav/>}

                                {contactUs && (
                                    <Dropdown
                                        pullRight
                                        className="header-contact-us"
                                        id="header-contact-us"
                                    >
                                        <CustomToggle bsRole="toggle">
                                            {localized('contactus', 'Contact Us')}
                                        </CustomToggle>
                                        <Dropdown.Menu>
                                            <MenuItem href="tel:1800-CNY-AUD">
                                                {localized('australia.phone', 'Australia 1800-CNY-AUD')}
                                            </MenuItem>
                                            <MenuItem href="tel:0800-003-114">
                                                {localized(
                                                    'newzealand.phone',
                                                    'New Zealand 0800 003 114'
                                                )}
                                            </MenuItem>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}

                                {support && (
                                    <Link className="header-contact-us" to="/support">
                                        Support
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
