import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {locale, messages} from '../../i18n';
import * as formValidations from '../../forms/formValidations';
import {renderInput, renderSelect} from '../../forms/Fields';
import {COUNTRY_CODE, CURRENCIES, CURRENCIES_CODE_NUMBER, ONBOARD} from '../../constants';
import Alert from 'react-s-alert';
import Api from '../../api';
import countryZH from "../../i18n/country_zh";
import countryEN from "../../i18n/country_en";
import normalizeBankAccount from "../../forms/normalizeBankAccount";
import {actions as nzbnActions} from "../../redux/ducks/nzbn";

const localized = (key, message) => messages[locale][key] || message || key;

const countryMap = locale === 'en' ? countryEN : countryZH;

const currencyMap = Object.keys(CURRENCIES)
    .filter(item => CURRENCIES[item].code !== 'CNY')
    .map(key => {
        const code = CURRENCIES[key].code;
        return {text: localized(code), value: code};
    });

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

    goBackBtnClicked = () => {
        this.props.goBack();
    };

    clearOnBlur(e) {
        e.preventDefault();
    }

    clearOnBlurRegisterName = e => {
        e.preventDefault();

        //help choseCompany
        const {fetchedList} = this.props;
        window.setTimeout(() => {
            fetchedList([]);
        }, 300);
    };

    changeRegisteredName = input => {
        const {country, fetchList, fetchedList} = this.props;
        const text = input.target.value;
        if (country === 'New Zealand' && text && text.length > 0) {
            fetchList({
                searchType: 'registered_name',
                text
            });
        } else {
            fetchedList([]);
        }
    };

    changeRegisteredNumber = input => {
        const {country, fetchList, fetchedList} = this.props;
        const text = input.target.value;
        if (country === 'New Zealand' && text && text.length > 0) {
            fetchList({
                searchType: 'registered_no',
                text
            });
        } else {
            fetchedList([]);
        }
    };

    chooseCompany = company => () => {
        const {change, fetchedList, fetchCompany} = this.props;
        fetchCompany(company.nzbn);

        fetchedList([]);

        change('registered_name', company.entityName);

        if (company.sourceRegisterUniqueId) {
            change('registered_no', company.sourceRegisterUniqueId);
        }

        localStorage.setItem(ONBOARD.NZBN, company.nzbn);
    };

    renderSearchList = searchList => {
        return (
            <div className="onboard-search-list">
                <table>
                    <tbody>
                    {searchList.map((item, index) => (
                        <tr key={index} onClick={this.chooseCompany(item)}>
                            <td>{item.entityName}</td>
                            <td className="onboard-search-list_register_no">
                                <span className="onboard-search-list_tips">
                                  {localized('onboard.register_no', 'Register No.')}
                                </span>
                                <br/>
                                {item.sourceRegisterUniqueId}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    componentWillReceiveProps({searchCompany}) {
        const {change} = this.props;

        if (Object.keys(searchCompany).length === 0) return;

        const {physicalAddress, roles} = searchCompany;
        if (physicalAddress && physicalAddress.length > 0) {
            const [
                {address3, address2, address1, careOf, postCode}
            ] = physicalAddress;

            if (address3) change('city', address3);
            if (address2) change('district', address2);
            let street = careOf && careOf.length > 0 ? careOf : '';
            if (address1) street = street + ' ' + address1;
            if (street.length > 0) {
                change('street', street);
            }

            if (postCode) change('zip', postCode);
        }

        if (roles && roles.length > 0) {
            const directors = roles.filter(
                item => item.roleType === 'Director' && item.roleStatus === 'ACTIVE'
            );

            directors.forEach(({roleAddress = [{}], rolePerson = {}}, index) => {
                change(`owners[${index}].type`, 'director');

                const [
                    {address3, address2, address1, careOf, postCode, countryCode}
                ] = roleAddress;
                if (address3) change(`owners[${index}].city`, address3);
                if (address2) change(`owners[${index}].district`, address2);
                let street = careOf && careOf.length > 0 ? careOf : '';
                if (address1) street = street + ' ' + address1;
                if (street.length > 0) {
                    change(`owners[${index}].street`, street);
                }

                if (postCode) change(`owners[${index}].zip`, postCode);

                if (countryCode && COUNTRY_CODE[countryCode])
                    change(`owners[${index}].country`, COUNTRY_CODE[countryCode]);

                const {firstName = '', lastName = ''} = rolePerson;
                change(
                    `owners[${index}].name`,
                    (firstName.length > 0 ? firstName : '') + ' ' + lastName
                );
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
                        change('country', info.country);
                        change('registered_name', info.registered_name);
                        change('registered_no', info.registered_no);
                        change('street', info.street);
                        change('district', info.district);
                        change('city', info.city);
                        change('zip', info.zip);
                        change('settle_bank_name', info.settle_bank_name);
                        change('currency', info.currency);
                        change('settle_bank_account_name', info.settle_bank_account_name);
                        change('settle_bank_no', info.settle_bank_no);
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

    onSubmit = (form) => {
        this.postData();
    };

    async postData() {
        this.setState({submitting: true});

        const {
            country,
            registered_name,
            registered_no,
            street,
            district,
            city,
            zip,
            settle_bank_name,
            currency,
            settle_bank_account_name,
            settle_bank_no,
            step
        } = this.props;

        const {
            goToNext
        } = this.state;

        let stepData = {
            'step': step,
            'version': 2,
            'country': country,
            'registered_name': registered_name,
            'registered_no': registered_no,
            'street': street,
            'city': city,
            'zip': zip,
            'settle_bank_name': settle_bank_name,
            'currency': currency,
            'settle_bank_account_name': settle_bank_account_name,
            'settle_bank_no': settle_bank_no
        };

        if (district) {
            stepData['district'] = district;
        }

        console.log('Step2Data:', stepData);

        localStorage.setItem(ONBOARD.CURRENCY, currency);

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
            this.props.goForward();
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
            searchType,
            searchList,
            currency
        } = this.props;

        const {
            submitting
        } = this.state;

        return (
            <form id="onboard_form_step_2" name="onboardStep2"  className="onboard-full" onSubmit={handleSubmit(convert(this.onSubmit))}>
                <div className="row">
                    <div className="col-sm-6">
                        <h4>
                            2/3 {localized('onboard.title.company_info', 'Company Information')}
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
                            className="col-sm-6"
                            name="country"
                            component={renderSelect}
                            options={countryMap}
                            label={localized('onboard.country', 'Country')}
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                    </div>
                    <div className="row">
                        <Field
                            className="col-sm-6"
                            name="registered_name"
                            component={renderInput}
                            label={localized('onboard.registered_name', 'Business Legal Name')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlurRegisterName}
                            onChange={this.changeRegisteredName}
                            autoComplete="off"
                        >
                            {searchType === 'registered_name' && this.renderSearchList(searchList)}
                        </Field>
                        <Field
                            name="registered_no"
                            className="col-sm-6"
                            component={renderInput}
                            label={localized('onboard.registered_no', 'Company Number')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onChange={this.changeRegisteredNumber}
                        >
                            {searchType === 'registered_no' && this.renderSearchList(searchList)}
                        </Field>
                    </div>
                    <div className="row">
                        <Field
                            name="street"
                            className="col-sm-12"
                            component={renderInput}
                            label={localized('onboard.company.address', 'Company Physical Address')}
                            placeholder={localized('onboard.street', 'Street Address')}
                            validate={[formValidations.required]}
                        />

                    </div>
                    <div className="row">
                        <Field
                            name="district"
                            className="col-sm-12"
                            hideLabel="true"
                            component={renderInput}
                            placeholder={localized('onboard.district', 'Address Line 2')}
                        />
                    </div>
                    <div className="row">
                        <Field
                            name="city"
                            className="col-sm-6"
                            component={renderInput}
                            hideLabel="true"
                            placeholder={localized('onboard.city', 'City')}
                            validate={[formValidations.required]}
                        />
                        <Field
                            name="zip"
                            className="col-sm-6"
                            component={renderInput}
                            hideLabel="true"
                            placeholder={localized('onboard.zip', 'Zip / Postal Code')}
                            validate={[formValidations.required]}
                        />
                    </div>
                </div>
                <div className="onboard-card">
                    <div className="row">
                        <Field
                            className="col-sm-6"
                            name="settle_bank_name"
                            component={renderInput}
                            label={localized('onboard.bank_name', 'Bank Name')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                        <Field
                            className="col-sm-6"
                            name="currency"
                            component={renderSelect}
                            options={currencyMap}
                            label={localized('onboard.currency', 'Currency')}
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                    </div>
                    <div className="row">
                        <Field
                            className="col-sm-6"
                            name="settle_bank_account_name"
                            component={renderInput}
                            label={localized('onboard.bank_account_name', 'Bank Account Name')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                        <Field
                            className="col-sm-6"
                            name="settle_bank_no"
                            component={renderInput}
                            label={localized('onboard.bank_no', 'Bank Account Number')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                            normalize={normalizeBankAccount(CURRENCIES_CODE_NUMBER[currency])}
                        />
                    </div>
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
                                {localized('onboard.next', 'Next')}
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

const selector = formValueSelector('OnboardStep2');

export default connect(state => {
    let stateObj = {
        country: selector(state, 'country'),
        registered_name: selector(state, 'registered_name'),
        registered_no: selector(state, 'registered_no'),
        street: selector(state, 'street'),
        district: selector(state, 'district'),
        city: selector(state, 'city'),
        zip: selector(state, 'zip'),

        settle_bank_name: selector(state, 'settle_bank_name'),
        currency: selector(state, 'currency'),
        settle_bank_account_name: selector(state, 'settle_bank_account_name'),
        settle_bank_no: selector(state, 'settle_bank_no')
    };

    stateObj.searchType = state.nzbn.searchType;
    stateObj.searchList = state.nzbn.list;
    stateObj.searchCompany = state.nzbn.company;

    return stateObj;
}, nzbnActions)(
    reduxForm({
        form: 'OnboardStep2'
    })(Step));
