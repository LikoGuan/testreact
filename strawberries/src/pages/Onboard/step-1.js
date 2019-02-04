import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {locale, messages} from '../../i18n';
import * as formValidations from '../../forms/formValidations';
import {renderInput} from '../../forms/Fields';
import Api from '../../api';
import {ONBOARD} from '../../constants';
import Alert from 'react-s-alert';

const localized = (key, message) => messages[locale][key] || message || key;

class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goToNext: true,
            width: 0,
            modal: true,
            company_type: '',
            current_step_completed: false,
            contact_first_name: '',
            contact_family_name: '',
            contact_phone: '',
            contact_email: ''
        };

        this.saveForLater = this.saveForLater.bind(this);
    }

    componentWillMount = () => {
        let onboardId = localStorage.getItem(ONBOARD.ID);
        if (onboardId) {
            this.loadData(onboardId);
        }
    };

    async loadData(id) {
        const promise = await Api.onboardWithSteps.get(id);
        const {change} = this.props;

        if (promise) {
            const {data} = promise;

            if (data) {
                try {
                    const info = JSON.parse(data.info);
                    if (info) {
                        change('contact_first_name', info.contact_first_name);
                        change('contact_family_name', info.contact_family_name);
                        change('contact_phone', info.contact_phone);
                        change('contact_email', info.contact_email);
                    }
                } catch (e) {
                    console.log('Failed to parse onboarding data');
                    Alert.warning(localized('onboard.load_data_failed', 'Failed to parse onboarding data, please start over'));
                    localStorage.removeItem(ONBOARD.ID);
                }
            } else {
                console.log('Failed to fetch previous recorded onboarding data');
                Alert.warning(localized('onboard.fetch_data_failed', 'Failed to fetch previous recorded onboarding data'));
            }
        } else {
            console.log('Failed to fetch previous recorded onboarding data');
            Alert.warning(localized('onboard.fetch_data_failed', 'Failed to fetch previous recorded onboarding data'));
        }
    }

    async postData() {
        this.setState({submitting: true});

        const {
            contact_first_name,
            contact_family_name,
            contact_phone,
            contact_email,
            step,
            source
        } = this.props;

        const {
            goToNext
        } = this.state;

        let onboardId = localStorage.getItem(ONBOARD.ID);

        let step1Data = {
            'step': step,
            'version': 2,
            'contact_first_name': contact_first_name,
            'contact_family_name': contact_family_name,
            'contact_phone': contact_phone,
            'contact_email': contact_email
        };

        if (source && !onboardId) {
            step1Data.source = source;
        }

        console.log('Step1Data', step1Data);

        if (onboardId) {
            await Api.onboardWithSteps.put(onboardId, step1Data);
        } else {
            const {data} = await Api.onboardWithSteps.post(step1Data);
            localStorage.setItem(ONBOARD.ID, data.id);
        }

        this.setState({submitting: false});

        if (goToNext) {
            this.props.goForward();
        } else {
            this.setState({goToNext: true});
            Alert.success(localized('onboard.save_for_later.success', 'Saved'));
        }
    };

    onSubmit = (event) => {
        this.postData();
    };

    saveForLater() {
        this.setState({goToNext: false}, () => {
            document.getElementById('submitButton').click();
        });
    }

    render() {
        const convert = onSubmit => form => {
            onSubmit(form);
        };

        const {
            handleSubmit
        } = this.props;

        const {
            submitting
        } = this.state;

        return (
            <form id="onboard_form_step_1" name="onboardStep1" className="onboard-full" onSubmit={handleSubmit(convert(this.onSubmit))} ref="stepForm">
                <h2 className="onboard-homepage-title"><b>{localized('onboard.homepage.title', 'Merchant Application Form')}</b></h2>
                <p className="onboard-homepage-subtitle">
                    {localized('onboard.homepage.subtitle.1', 'Welcome to Latipay\'s on-boarding page.')}
                    <br/>
                    {localized(
                        'onboard.homepage.subtitle.2',
                        'Because Latipay is a fully-compliant financial company we require just a few pieces of information to comply with local Anti Money Laundering laws. Once you’re on-board you will be able to use the most popular Chinese payment methods with over 1 billion Chinese customers.'
                    )}
                </p>
                <div className="row">
                    <div className="col-sm-6">
                        <h4>
                            1/3 {localized('onboard.title.contact', 'Key Contact Details')}
                        </h4>
                    </div>
                    <div className="col-sm-6">
                        <h4 className="save-for-later">
                            <a onClick={this.saveForLater} className="pull-right">{localized('onboard.save_for_later', 'Save for later')}</a>
                        </h4>
                    </div>
                </div>
                <div className="onboard-card">
                    <div className="row">
                        <Field
                            name="contact_first_name"
                            className="col-sm-6"
                            component={renderInput}
                            label={localized('onboard.contact.first_name', 'First Name & Middle Name (optional)')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                        <Field
                            name="contact_family_name"
                            className="col-sm-6"
                            component={renderInput}
                            label={localized('onboard.contact.family_name', 'Last Name')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                    </div>
                    <div className="row">
                        <Field
                            name="contact_phone"
                            className="col-sm-6"
                            component={renderInput}
                            label={localized('onboard.contact.phone', 'Phone Number')}
                            placeholder=" "
                            validate={[formValidations.required, formValidations.phoneNumber]}
                            onBlur={this.clearOnBlur}
                        />
                        <Field
                            name="contact_email"
                            className="col-sm-6"
                            component={renderInput}
                            label={localized('onboard.contact.email', 'Email')}
                            placeholder=" "
                            validate={[formValidations.required, formValidations.email]}
                            onBlur={this.clearOnBlur}
                        />
                    </div>
                </div>

                <div className="row onboard-footers">
                    <div className="col-md-4 col-md-offset-4 col-sm-12">
                        <button
                            id="submitButton"
                            type="submit"
                            className="btn btn-primary btn-form onboard-step-button-main"
                            disabled={submitting}
                        >
                            {localized('onboard.next', 'Next')}
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

const selector = formValueSelector('OnboardStep1');

export default connect(state => {
    let stageObj = {
        contact_first_name: selector(state, 'contact_first_name'),
        contact_family_name: selector(state, 'contact_family_name'),
        contact_phone: selector(state, 'contact_phone'),
        contact_email: selector(state, 'contact_email')
    };

    return stageObj;
})(
    reduxForm({
        form: 'OnboardStep1'
    })(Step)
);
