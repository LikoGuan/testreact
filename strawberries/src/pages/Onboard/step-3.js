import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, formValueSelector, reduxForm} from 'redux-form';
import {locale, messages} from '../../i18n';
import * as formValidations from '../../forms/formValidations';
import {renderInput, renderRadio} from '../../forms/Fields';
import {actions as nzbnActions} from "../../redux/ducks/nzbn";
import {ONBOARD} from "../../constants";
import Api from "../../api";
import Alert from "react-s-alert";
import {getDateDMYDisplay} from "../../util";
import OnboardFileList from "../../forms/OnboardFileList";
import history from "../../history";

const localized = (key, message) => messages[locale][key] || message || key;

export class Step extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goToNext: true,
            width: 0,
            modal: true,
            current_step_completed: false
        };

        this.saveForLater = this.saveForLater.bind(this);
    }

    componentWillMount = () => {
        let onboardId = localStorage.getItem(ONBOARD.ID);
        if (onboardId) {
            this.loadData(onboardId);
        }
    };

    componentWillReceiveProps({searchCompany}) {
        const {change} = this.props;

        if (Object.keys(searchCompany).length === 0) return;

        const {roles} = searchCompany;

        if (roles && roles.length > 0) {
            const directors = roles.filter(
                item => item.roleType === 'Director' && item.roleStatus === 'ACTIVE'
            );

            directors.forEach(({roleAddress = [{}], rolePerson = {}}, index) => {
                const {firstName = '', lastName = ''} = rolePerson;
                change(`owners[${index}].name`, (firstName.length > 0 ? firstName : '') + ' ' + lastName);
                change(`owners[${index}].type`, 'director');
            });
        }

        //clear searched company
        this.props.fetchedCompany({});
    }

    async loadData(id) {
        const promise = await Api.onboardWithSteps.get(id);
        const {change} = this.props;

        if (promise) {
            const {data} = promise;
            if (data) {
                try {
                    const info = JSON.parse(data.info);
                    if (info) {
                        if (info.certificate_pics && info.certificate_pics.length > 0) {
                            change('certificate_pics', info.certificate_pics);
                        }

                        if (info.settle_pics && info.settle_pics.length > 0) {
                            change('settle_pics', info.settle_pics);
                        }

                        if (info.website) {
                            change('website', info.website);
                        }

                        if (info.store_pics && info.store_pics.length > 0) {
                            change('store_pics', info.store_pics);
                        }

                        if (info.owners && info.owners.length > 0) {
                            info.owners.forEach((item, index) => {
                                change(`owners[${index}].name`, item.name);
                                change(`owners[${index}].type`, item.type);
                                change(`owners[${index}].id_pics`, item.id_pics);
                                change(`owners[${index}].address_pics`, item.address_pics);
                            })
                        } else {
                            const {fetchCompany} = this.props;
                            let companyNzbn = localStorage.getItem(ONBOARD.NZBN);
                            if (companyNzbn) {
                                fetchCompany(companyNzbn);
                            }
                        }
                    }
                } catch (e) {
                    console.log('Failed to parse onboarding data');
                    Alert.warning(localized('onboard.load_data_failed_step2+', 'Failed to parse onboarding data, going back to step 1'));
                    localStorage.removeItem(ONBOARD.ID);
                    this.props.gotoOnboarding();
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

    renderOwner = ({fields, meta: {touched, error, submitFailed}}) => (
        <div>
            {
                fields.map((item, index) => {
                    return (
                        <div key={index} className="onboard-shareholder-card">
                            <div className="row">
                                <Field
                                    className="col-sm-5"
                                    name={`${item}.name`}
                                    component={renderInput}
                                    hideLabel="true"
                                    placeholder={localized('onboard.owner.name', 'Full Name')}
                                    validate={[formValidations.required]}
                                    onBlur={this.clearOnBlur}
                                />
                                <Field
                                    className="col-sm-2"
                                    name={`${item}.type`}
                                    component={renderRadio}
                                    label={localized('onboard.documents.owner.director', ' Director')}
                                    radioValue="director"
                                    validate={[formValidations.required]}
                                />
                                <Field
                                    className="col-sm-3"
                                    name={`${item}.type`}
                                    component={renderRadio}
                                    label={localized('onboard.documents.owner.shareholder', ' Shareholder')}
                                    radioValue="shareholder"
                                    validate={[formValidations.required]}
                                />
                                {index > 0 && (
                                    <a onClick={() => {
                                        this.removeOwner(index);
                                    }} className="col-sm-1 pull-right onboard-shareholder-del" name="delete">
                                        {localized('onboard.documents.delete', 'Delete')}
                                    </a>
                                )}
                            </div>
                            <div className="row">
                                <span className="col-sm-10">
                                    - {localized('onboard.documents.shareholder.photoid', 'Passport (Photo ID page)')}
                                </span>
                            </div>
                            <div className="row">
                                <span className="col-sm-6 onboard-documents-upload">
                                    <FieldArray
                                        id={`${item}.id_pics`}
                                        name={`${item}.id_pics`}
                                        component={OnboardFileList}
                                        title={localized('onboard.documents.upload', '+ Upload')}
                                        oss={this.props.ossTemp}
                                        max="1"
                                        validate={[formValidations.required]}
                                    />
                                </span>
                            </div>
                            <div className="row">
                                <span className="col-sm-10">
                                    - {localized('onboard.documents.shareholder.proof_of_address', 'Personal Utility Bill or Bank Statement (for proof of personal address)')}
                                </span>
                            </div>
                            <div className="row">
                                <span className="col-sm-6 onboard-documents-upload">
                                    <FieldArray
                                        id={`${item}.address_pics`}
                                        name={`${item}.address_pics`}
                                        component={OnboardFileList}
                                        title={localized('onboard.documents.upload', '+ Upload')}
                                        oss={this.props.ossTemp}
                                        max="1"
                                        validate={[formValidations.required]}
                                    />
                                </span>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );

    addOwner = () => {
        const {array} = this.props;
        array.push('owners', {});
    };

    removeOwner(index) {
        const {array} = this.props;
        array.remove('owners', index);
    }

    clearOnBlur(e) {
        e.preventDefault();
    }

    goBackBtnClicked = () => {
        this.props.goBack();
    };

    onSubmit = (form) => {
        const {
            certificate_pics,
            settle_pics,
            store_pics,
            owners
        } = form;

        let isUploading = false;

        if (certificate_pics) {
            certificate_pics.forEach(pic => {
                if (pic && !pic.url) {
                    isUploading = true;
                }
            });
        }

        if (settle_pics) {
            settle_pics.forEach(pic => {
                if (pic && !pic.url) {
                    isUploading = true;
                }
            });
        }

        if (store_pics) {
            store_pics.forEach(pic => {
                if (pic && !pic.url) {
                    isUploading = true;
                }
            });
        }

        if (owners && owners.length > 0) {
            owners.forEach(owner => {
                const {id_pics, address_pics} = owner;

                if (id_pics) {
                    id_pics.forEach(pic => {
                        if (pic && !pic.url) {
                            isUploading = true;
                        }
                    });
                }

                if (address_pics) {
                    address_pics.forEach(pic => {
                        if (pic && !pic.url) {
                            isUploading = true;
                        }
                    });
                }
            });
        }

        if (isUploading) {
            console.log('Files are still being uploaded, please wait...');
            Alert.warning(localized('onboard.file_is_uploading', 'Files are still being uploaded, please wait...'));

            this.setState({submitting: false});
            return;
        }

        this.postData();
    };

    async postData() {
        this.setState({submitting: true});

        const {
            step,
            certificate_pics,
            settle_pics,
            website,
            store_pics,
            owners
        } = this.props;

        const {
            goToNext
        } = this.state;

        let stepData = {
            'step': step,
            'version': 2,
            'owners': owners,
            'certificate_pics': certificate_pics,
            'settle_pics': settle_pics,
            'store_pics': store_pics
        };

        if (website) {
            stepData['website'] = website;
        }

        console.log('Step3Data:', stepData);

        let onboardId = localStorage.getItem(ONBOARD.ID);
        if (onboardId) {
            await Api.onboardWithSteps.put(onboardId, stepData);
        } else {
            console.log('Something\'s wrong with data, please start over.');
            Alert.warning(localized('onboard.onboard_id_missing', 'Something\'s wrong with data, please start over.'));
            this.props.gotoOnboarding();
        }

        this.setState({submitting: false});

        if (goToNext) {
            // When done
            localStorage.removeItem(ONBOARD.ID);
            localStorage.removeItem(ONBOARD.NZBN);
            localStorage.removeItem(ONBOARD.CURRENCY);
            history.replace('/onboard/success');
        } else {
            this.setState({goToNext: true});
            Alert.success(localized('onboard.save_for_later.success', 'Saved'));
        }
    }

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
            handleSubmit,
            owners,
            ossTemp,
        } = this.props;

        const {
            submitting
        } = this.state;

        return (
            <form id="onboard_form_step_3" name="onboardStep2" className="onboard-full" onSubmit={handleSubmit(convert(this.onSubmit))}>
                <div className="row">
                    <div className="col-sm-6">
                        <h4>
                            3/3 {localized('onboard.title.documents', 'Document Check List')}
                        </h4>
                    </div>
                    <div className="col-sm-6">
                        <h4 className="save-for-later">
                            <a onClick={this.saveForLater} className="pull-right">{localized('onboard.save_for_later', 'Save for later')}</a>
                        </h4>
                    </div>
                </div>
                <div className="onboard-card">
                    <p><b>1. {localized('onboard.documents.company_details', 'Company Details')}</b></p>
                    <div className="row indent">
                        <span className="col-sm-10">
                            - {localized('onboard.documents.company_certificate', 'Company Certificate')}
                        </span>
                    </div>
                    <div className="row indent">
                        <span className="col-sm-6 onboard-documents-upload">
                            <FieldArray
                                id="certificate_pics"
                                name="certificate_pics"
                                component={OnboardFileList}
                                title={localized('onboard.documents.upload', '+ Upload')}
                                oss={ossTemp}
                                max="1"
                                validate={[formValidations.required]}
                            />
                        </span>
                    </div>
                    <div className="row indent">
                        <span className="col-sm-10">
                            - {localized('onboard.documents.company_bank_statement', 'Business Bank Statement (can be a screenshot if preferred)')}
                        </span>
                    </div>
                    <div className="row indent">
                        <span className="col-sm-6 onboard-documents-upload">
                            <FieldArray
                                id="settle_pics"
                                name="settle_pics"
                                component={OnboardFileList}
                                title={localized('onboard.documents.upload', '+ Upload')}
                                oss={ossTemp}
                                max="1"
                                validate={[formValidations.required]}
                            />
                        </span>
                    </div>
                </div>
                <div className="onboard-card">
                    <p><b>2. {localized('onboard.documents.business_details', 'Your Business Details')}</b></p>
                    <div className="row indent">
                        <span className="col-sm-10">
                            - {localized('onboard.documents.website', 'If you have an E-commerce website, please enter the address below:')}
                        </span>
                    </div>
                    <div className="row indent">
                        <Field
                            className="col-sm-8 indent"
                            name="website"
                            component={renderInput}
                            hideLabel="true"
                            placeholder={localized('onboard.website', 'Website Address')}
                            onBlur={this.clearOnBlur}
                        />
                    </div>
                    <div className="row indent">
                        <span className="col-sm-10">
                            - {localized('onboard.documents.store', 'If you have a physical location, please upload 2-5 photos below:')}
                        </span>
                    </div>
                    <div className="row indent">
                        <span
                            className="col-sm-10 indent">{localized('onboard.documents.physical_store', 'One from outside showing your logo & one from inside showing your products.')}</span>
                    </div>
                    <div className="row indent">
                        <span className="col-sm-6 onboard-documents-upload">
                            <FieldArray
                                id="store_pics"
                                name="store_pics"
                                component={OnboardFileList}
                                title={localized('onboard.documents.upload', '+ Upload')}
                                oss={ossTemp}
                                max="5"
                            />
                        </span>
                    </div>
                </div>
                <div className="onboard-card">
                    <p>
                        <b>3. {localized('onboard.documents.director_shareholder', 'Director & Shareholders Details who own 25% or more of the company.')}</b>
                    </p>
                    <FieldArray name="owners" component={this.renderOwner}/>
                    {owners.length < 4 && (
                        <div className="row text-center">
                            <a onClick={this.addOwner}
                               className="col-sm-12 onboard-documents-upload">+ {localized('onboard.owners.add', 'ADD')}</a>
                        </div>
                    )}
                </div>
                <br/>
                <br/>
                <div className="row">
                    <p className="col-sm-7">
                        <b>*{localized('onboard.terms.declare', 'I hereby certify that all the above information is accurate and true.')}</b>
                    </p>
                    <p className="col-sm-5 text-right ">
                        {localized('onboard.time', 'Application Date')}
                        ：{getDateDMYDisplay()}
                    </p>
                </div>
                <div className="row">
                    <p className="col-sm-12">
                        *{localized(
                        'onboard.terms.tips',
                        ' By clicking submit, you have agreed to our '
                    )}
                        <a className="link terms" target="_blank" href="/Merchant%20Terms%20and%20Conditions.pdf">
                            {localized('onboard.terms', 'Terms & Conditions')}
                        </a>
                        {', '}
                        <a
                            className="link terms"
                            target="_blank"
                            href="/Enterprise_Merchant_Agreement.pdf"
                        >
                            {localized('onboard.agreement', 'Enterprise Merchant Agreement.')}
                        </a>
                    </p>
                </div>
                <div className="onboard-footers">
                    <div className="row">
                        <div className="col-md-4 col-md-offset-4 col-sm-12">
                            <button
                                id="submitButton"
                                type="submit"
                                className="btn btn-primary btn-form onboard-step-button-main"
                                disabled={submitting}
                            >
                                {localized('onboard.submit', 'Submit')}
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-4 col-sm-12 text-center">
                            <a onClick={this.goBackBtnClicked}>{localized('onboard.previous', 'BACK')}</a>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

const selector = formValueSelector('OnboardStep3');

export default connect(state => {
    let stateObj = {
        website: selector(state, 'website'),
        store_pics: selector(state, 'store_pics'),
        settle_pics: selector(state, 'settle_pics'),
        certificate_pics: selector(state, 'certificate_pics'),
        owners: selector(state, 'owners') || [{}],
    };

    stateObj.searchCompany = state.nzbn.company;
    stateObj.ossTemp = state.ossTemp;

    return stateObj;
}, nzbnActions)(
    reduxForm({
        form: 'OnboardStep3',
        initialValues: {
            owners: [{}]
        }
    })(Step));
