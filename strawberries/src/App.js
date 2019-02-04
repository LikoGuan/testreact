import React from 'react';
import {Switch, Route} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import ResetPwd from './pages/ResetPwd';
import SetPwd from './pages/SetPwd';
import SignUp from './pages/SignUp';

import NotFound from './pages/NotFound';

import Summary from './pages/Summary';
import Invoices from './pages/Invoices';
import Coupons from './pages/Coupons';
import Setting from './pages/Setting';
import Activate from './pages/Activate';

import Mode from './layout/Mode';
import FullOnboard from './pages/Onboard/FullOnboard';
import OnboardSteps from './pages/Onboard/index';
import QRGenerator from './pages/QRGenerator/index';

import Support from './pages/Support/';

const lightmode = Mode({mode: 'light', header: {lite: true}});
const darkmode = Mode({mode: 'dark', header: {lite: false}});

const LoginLightmode = Mode({
    mode: 'light',
    header: {lite: true, support: true}
});
const _Login = LoginLightmode(Login);

const _ResetPwd = lightmode(ResetPwd);
const _SetPwd = lightmode(SetPwd);
const _SignUp = lightmode(SignUp);
const _Activate = lightmode(Activate);

const _Summary = darkmode(Summary);
const _Invoices = darkmode(Invoices);
const _Coupons = darkmode(Coupons);
const _Setting = darkmode(Setting);

const _NotFound = lightmode(NotFound);

const onboardLightmode = Mode({
    mode: 'light onboard',
    header: {lite: true, contactUs: true}
});
const _FullOnboard = onboardLightmode(FullOnboard);
const _OnboardSteps = onboardLightmode(OnboardSteps);

const _QRGenerator = lightmode(QRGenerator);

const App = ({location}) => (
    <Switch>
        <Route path="/login" component={_Login}/>
        <Route path="/qr-generator" exact component={_QRGenerator}/>
        <Route path="/resetpwd" component={_ResetPwd}/>
        <Route path="/setpwd/:nonce" component={_SetPwd}/>
        <Route path="/activate/:nonce" component={_Activate}/>

        <Route path="/signup" component={_SignUp}/>
        <Route path="/support" component={Support}/>

        <PrivateRoute path="/" exact component={_Summary}/>
        <PrivateRoute path="/index.html" component={_Summary}/>

        <PrivateRoute path="/invoices" component={_Invoices}/>
        <PrivateRoute path="/coupons" component={_Coupons}/>
        <PrivateRoute path="/setting" component={_Setting}/>
        <Route path="/onboard" component={_OnboardSteps}/>
        <Route path="/full-onboard" component={_FullOnboard}/>
        <Route path="/join" component={_FullOnboard}/>

        <Route component={_NotFound}/>
    </Switch>
);

export default App;
