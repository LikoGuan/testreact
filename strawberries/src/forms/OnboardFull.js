import React, {Component} from 'react';
import {Field, reduxForm, FieldArray, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {messages, locale} from '../i18n';
import countryZH from '../i18n/country_zh';
import countryEN from '../i18n/country_en';
import normalizeBankAccount from './normalizeBankAccount';
import {CURRENCIES_CODE_NUMBER, COUNTRY_CODE} from '../constants';
// import Alert from "react-s-alert";
// import history from "../history";
import {actions as nzbnActions} from '../redux/ducks/nzbn';

import * as formValidations from './formValidations';
import {
    renderInput,
    renderSelect,
    renderCheckbox,
    // renderRadio
} from './Fields';

import FilePicture from './OnboardFilePicture';
import {CURRENCIES} from '../constants';
import icons from '../icons';
import {getDateDMYDisplay} from '../util';

import '../css/onboard.css';

const localized = (key, message) => messages[locale][key] || message || key;

/*const industry = [
    'Commercial trading',
    'Travel & Tourism',
    'Education',
    'Airline Tickets',
    'Hospitality',
    'Catering',
    'Others'
];*/

/*const industryMap = industry.map(item => {
    return {text: localized(item), value: item};
});*/

const currencyMap = Object.keys(CURRENCIES)
    .filter(item => CURRENCIES[item].code !== 'CNY')
    .map(key => {
        const code = CURRENCIES[key].code;
        return {text: localized(code), value: code};
    });

/*const socialNetwork = [
    '',
    'Facebook',
    'Twitter',
    'LinkedIn',
    'Latipay Commercial Website',
    'Latipay Wechat Official Account',
    'Latipay Merchant'
];*/

/*const socialNetworkMap = socialNetwork.map(item => {
    return {text: localized(item), value: item};
});*/

/*const times = [
    {value: '00:00', text: '00:00'},
    {value: '01:00', text: '01:00'},
    {value: '02:00', text: '02:00'},
    {value: '03:00', text: '03:00'},
    {value: '04:00', text: '04:00'},
    {value: '05:00', text: '05:00'},
    {value: '06:00', text: '06:00'},
    {value: '07:00', text: '07:00'},
    {value: '08:00', text: '08:00'},
    {value: '09:00', text: '09:00'},
    {value: '10:00', text: '10:00'},
    {value: '11:00', text: '11:00'},
    {value: '12:00', text: '12:00'},
    {value: '13:00', text: '13:00'},
    {value: '14:00', text: '14:00'},
    {value: '15:00', text: '15:00'},
    {value: '16:00', text: '16:00'},
    {value: '17:00', text: '17:00'},
    {value: '18:00', text: '18:00'},
    {value: '19:00', text: '19:00'},
    {value: '20:00', text: '20:00'},
    {value: '21:00', text: '21:00'},
    {value: '22:00', text: '22:00'},
    {value: '23:00', text: '23:00'}
];*/

export const pluginsMap = [
    {name: 'plugin_woocommerce', label: 'WooCommerce'},
    {name: 'plugin_shopify', label: 'Shopify'},
    {name: 'plugin_ecshop', label: 'EcShop'},
    {name: 'plugin_opencart', label: 'OpenCart'},
    {name: 'plugin_shopex', label: 'ShopEx'},
    {name: 'plugin_cscart', label: 'CS Cart'},
    {name: 'plugin_other', label: 'Other'}
];

const ownerTypeMap = [
    {text: localized('Director'), value: 'director'},
    {text: localized('Shareholder'), value: 'shareholder'}
];

const countryMap = locale === 'en' ? countryEN : countryZH;

class OnboardFullForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            modal: true,
            company_type: 'private'
        };
    }

    // componentWillUnmount() {
    //   window.removeEventListener("resize", this.updateWindowDimensions);
    // }
    //
    // updateWindowDimensions = () => {
    //   const w = window.document.getElementById("onboard_form").offsetWidth;
    //   this.setState({ width: w });
    // };

    clearOnBlur(e) {
        e.preventDefault();
    }

    addDirector = () => {
        const {array} = this.props;
        array.push('owners', {
            identity_type: 'passport'
        });
    };

    addBankEmail = () => {
        const {array} = this.props;
        array.push('settle_emails', '');
    };

    removeEmail = index => {
        const {array} = this.props;
        array.remove('settle_emails', index);
    };

    removeOwner(index) {
        const {array} = this.props;
        array.remove('owners', index);
    }

    selectPrivateType = () => {
        this.setState({
            company_type: 'private'
        });
    };

    selectPublicType = () => {
        this.setState({
            company_type: 'public'
        });
    };

    componentDidMount() {
        if (this.companyIdPicsDiv && this.companyAddressPicsDiv) {
            const labelHeight = Math.max(
                this.companyIdPicsDiv.clientHeight,
                this.companyAddressPicsDiv.clientHeight
            );

            this.setState({
                labelHeight
            });
        }
    }

    submitBtnClicked = () => {
        // Alert.success("Success.");
        // history.replace("/onboard/success");
        // return;

        const props = this.props;
        const {change, sceneOnline, sceneOffline, plugin_other_name} = this.props;

        const {company_type} = this.state;
        change('company_type', company_type);

        const scene = [];
        if (sceneOnline) {
            scene.push('online');
        }
        if (sceneOffline) {
            scene.push('offline');
        }
        change('scene', scene);

        if (sceneOnline) {
            const arr = [];
            pluginsMap.forEach(({name}) => {
                if (props[name]) {
                    if (name === 'plugin_other') {
                        arr.push(plugin_other_name);
                    } else {
                        arr.push(name.slice(7)); //remove plugin_
                    }
                }
            });
            change('plugins', arr);
        }
    };

    componentWillReceiveProps({currency: newCurrency, searchCompany}) {
        const {settle_bank_no, currency: oldCurrency, change} = this.props;

        if (newCurrency !== oldCurrency && settle_bank_no) {
            change(
                'settle_bank_no',
                normalizeBankAccount(CURRENCIES_CODE_NUMBER[newCurrency])(
                    settle_bank_no
                )
            );
        }

        if (Object.keys(searchCompany).length === 0) return;

        ////
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

        /////
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

    renderOwner = ({fields, meta: {touched, error, submitFailed}}) => (
        <div>
            {fields.map((item, index) => {
                return (
                    <div key={index}>
                        <h4>
                            {localized('onboard.owner', 'Shareholder Details')} #{index + 1}
                        </h4>
                        <div className="row">
                            <Field
                                name={`${item}.name`}
                                component={renderInput}
                                label={localized('onboard.name', 'Legal name')}
                                placeholder=" "
                                validate={[formValidations.required]}
                                onBlur={this.clearOnBlur}
                                className="col-sm-8"
                            />
                            <Field
                                name={`${item}.type`}
                                component={renderSelect}
                                options={ownerTypeMap}
                                label=" "
                                validate={[formValidations.required]}
                                onBlur={this.clearOnBlur}
                                className="col-sm-4"
                            />
                        </div>
                        {/*<div className="row">
                            <div className="form-group col-sm-3">
                                <label className="control-label">
                                    {localized('onboard.id.type', 'ID type')}
                                </label>
                                <input
                                    className="form-control input--id-type"
                                    readOnly={true}
                                    value={localized('passport', 'Passport')}
                                />
                            </div>
                            <Field
                                name={`${item}.identity_no`}
                                component={renderInput}
                                className="col-sm-9"
                                label={localized('onboard.id.numer', 'ID number')}
                                placeholder=" "
                                validate={[formValidations.required]}
                                onBlur={this.clearOnBlur}
                            />
                        </div>*/}
                        <Field
                            name={`${item}.street`}
                            component={renderInput}
                            label={localized('onboard.street', 'Home Address')}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                        <Field
                            name={`${item}.district`}
                            component={renderInput}
                            label={localized('onboard.district', 'Address Line 2')}
                            placeholder=" "
                            onBlur={this.clearOnBlur}
                        />
                        <div className="row">
                            <Field
                                name={`${item}.city`}
                                className="col-sm-6"
                                component={renderInput}
                                label={localized('onboard.city', 'City')}
                                placeholder=" "
                                validate={[formValidations.required]}
                                onBlur={this.clearOnBlur}
                            />
                            <Field
                                name={`${item}.zip`}
                                className="col-sm-6"
                                component={renderInput}
                                label={localized('onboard.zip', 'Zip/Postal Code')}
                                placeholder=" "
                                validate={[formValidations.required]}
                                onBlur={this.clearOnBlur}
                            />
                        </div>
                        <Field
                            name={`${item}.country`}
                            component={renderSelect}
                            options={countryMap}
                            label={localized('onboard.country', 'Country')}
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />

                        <div className="row">
                            <FieldArray
                                id={`${item}.id_pics`}
                                name={`${item}.id_pics`}
                                component={FilePicture}
                                rerenderOnEveryChange={true}
                                label={localized(
                                    'onboard.owner.id_pics',
                                    'Upload ID photo page copy'
                                )}
                                footer={localized(
                                    'onboard.pics.footer',
                                    'File types: JPG, PNG, PDF, maximum 10M.'
                                )}
                                footer2={localized(
                                    'onboard.owner.id_pics_tips',
                                    'ID: Passport, Driver License etc.'
                                )}
                                onBlur={this.clearOnBlur}
                                accept={'image/jpeg,image/png,application/pdf'}
                                validate={[formValidations.required]}
                                className="col-sm-6"
                            />
                            <FieldArray
                                id={`${item}.address_pics`}
                                name={`${item}.address_pics`}
                                component={FilePicture}
                                rerenderOnEveryChange={true}
                                label={localized(
                                    'onboard.owner.address_pics',
                                    'Upload Proof of Address'
                                )}
                                footer={localized(
                                    'onboard.pics.footer',
                                    'File types: JPG, PNG, PDF, maximum 10M.'
                                )}
                                footer2={localized(
                                    'onboard.address_pics.footer2',
                                    'Proof of Address: bank statement or utility bill (valid within the latest three months)'
                                )}
                                onBlur={this.clearOnBlur}
                                accept={'image/jpeg,image/png,application/pdf'}
                                validate={[formValidations.required]}
                                className="col-sm-6"
                            />
                        </div>

                        {index > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-action btn-action-remove"
                                onClick={() => {
                                    this.removeOwner(index);
                                }}
                            >
                                <div className="button-icon">{icons.bin}</div>
                                {localized('onboard.remove_owner', 'DELETE SHAREHOLDER')}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );

    renderSettleEmails = ({fields, meta: {touched, error, submitFailed}}) => (
        <div>
            {fields.map((item, index) => {
                return (
                    <div key={index} className="bank-email">
                        <Field
                            name={`${item}`}
                            component={renderInput}
                            label={`${localized(
                                'onboard.contact_email',
                                'Email for Transaction Report'
                            )} ${fields.length > 1 ? index + 1 : ''}`}
                            placeholder=" "
                            validate={[formValidations.required, formValidations.email]}
                            onBlur={this.clearOnBlur}
                        />

                        {index > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-action btn-action-remove btn-remove-email"
                                onClick={() => {
                                    this.removeEmail(index);
                                }}
                            >
                                <div className="button-icon">{icons.bin}</div>
                                DELETE
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );

    indexOf = title => {
        // const {sceneOffline} = this.props;
        const {company_type} = this.state;

        switch (title) {
            case 'key_contact':
                return 1;
            case 'scene':
                return 2;
            case 'company':
                return 3;
            case 'ownership':
                return 4;
            case 'bank':
                return company_type === 'private' ? 5 : 4;
            // case 'materials':
            //     return company_type === 'private' ? 7 : 6;
            // case 'learn_more':
            //     return (company_type === 'private' ? 7 : 6) + (sceneOffline ? 1 : 0);
            // case 'know_from':
            //     return (company_type === 'private' ? 8 : 7) + (sceneOffline ? 1 : 0);
            // case 'requirement':
            //     return (company_type === 'private' ? 9 : 8) + (sceneOffline ? 1 : 0);
            default:
        }
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

    clearOnBlurRegisterName = e => {
        e.preventDefault();

        //help choseCompany
        const {fetchedList} = this.props;
        window.setTimeout(() => {
            fetchedList([]);
        }, 300);
    };

    choseCompany = company => () => {
        const {change, fetchedList, fetchCompany} = this.props;
        fetchCompany(company.nzbn);

        fetchedList([]);

        change('registered_name', company.entityName);

        if (company.sourceRegisterUniqueId) {
            change('registered_no', company.sourceRegisterUniqueId);
        }

        if (company.nzbn) {
            change('nzbn', company.nzbn);
        }
    };

    changeRegisteredNumber = input => {
        const text = input.target.value;
        const {country, fetchList, fetchedList} = this.props;
        if (country === 'New Zealand' && text && text.length > 0) {
            fetchList({
                searchType: 'registered_no',
                text
            });
        } else {
            fetchedList([]);
        }
    };

    changeNZBN = input => {
        const text = input.target.value;
        const {country, fetchList, fetchedList} = this.props;
        if (country === 'New Zealand' && text && text.length > 0) {
            fetchList({
                searchType: 'nzbn',
                text
            });
        } else {
            fetchedList([]);
        }
    };

    renderSearchList = searchList => {
        return (
            <div className="onboard-search-list">
                <table>
                    <tbody>
                    {searchList.map((item, index) => (
                        <tr key={index} onClick={this.choseCompany(item)}>
                            <td>{item.entityName}</td>
                            <td className="onboard-search-list_register_no">
                                <span className="onboard-search-list_tips">
                                  {localized('onboard.register_no', 'Register No.')}
                                </span>
                                <br/>
                                {item.sourceRegisterUniqueId}
                            </td>
                            {/*<td>
                                <span className="onboard-search-list_tips">
                                  {localized('onboard.nzbn', 'NZBN')}
                                </span>
                                <br/>
                                {item.nzbn}
                            </td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    render() {
        const {
            handleSubmit,
            submitting,
            owners,
            sceneOnline,
            sceneOffline,
            // plugin_other,
            // settle_method,
            // business_industry,
            // from_social,
            currency,
            // materials_need,
            // materials_address_same,
            searchList,
            searchType
        } = this.props;

        const {company_type, labelHeight} = this.state;

        return (
            <form id="onboard_form" className="onboard-full" onSubmit={handleSubmit}>
                <div className="row">
                    <h3
                        className={classNames('col-md-5 onboard-type', {
                            'onboard-type--selected': company_type === 'private'
                        })}
                        onClick={this.selectPrivateType}
                    >
                        {localized('onboard.company_type.private', 'Private Owned')}
                    </h3>
                    <h3
                        className={classNames('col-md-7 onboard-type', {
                            'onboard-type--selected': company_type === 'public'
                        })}
                        onClick={this.selectPublicType}
                    >
                        {localized(
                            'onboard.company_type.public',
                            'Public Owned/Listed Company'
                        )}
                    </h3>
                </div>
                <h4>
                    {this.indexOf('key_contact')}.{' '}
                    {localized('onboard.title.contact', 'Key Contact Details')}
                </h4>
                <div className="row">
                    <Field
                        name="contact_first_name"
                        className="col-sm-6"
                        component={renderInput}
                        label={localized(
                            'onboard.contact.first_name',
                            'First Name & Middle Name(optional)'
                        )}
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
                <Field
                    name="contact_phone"
                    component={renderInput}
                    label={localized('onboard.contact.phone', 'Phone Number')}
                    placeholder=" "
                    validate={[formValidations.required, formValidations.phoneNumber]}
                    onBlur={this.clearOnBlur}
                />
                <Field
                    name="contact_email"
                    component={renderInput}
                    label={localized('onboard.contact.email', 'Email')}
                    placeholder=" "
                    validate={[formValidations.required, formValidations.email]}
                    onBlur={this.clearOnBlur}
                />

                <h4>
                    {this.indexOf('scene')}.{' '}
                    {localized('onboard.title.scene', 'I would like payments for:')}
                </h4>
                <Field
                    name="sceneOnline"
                    className="padding-bottom--none"
                    component={renderCheckbox}
                    label={localized('onboard.scene.online', 'E-commerce Website')}
                />
                <Field
                    name="sceneOffline"
                    component={renderCheckbox}
                    label={localized('onboard.scene.offline', 'Physical Store')}
                />
                <Field
                    name="currency"
                    component={renderSelect}
                    options={currencyMap}
                    label={localized('onboard.currency', 'Primary Currency')}
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                />
                {/*<Field
                    name="business_industry"
                    component={renderSelect}
                    options={industryMap}
                    label={localized('onboard.business_industry', 'Nature of Business')}
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                />
                {business_industry === 'Others' && (
                    <Field
                        name="business_industry_other"
                        hideLabel={true}
                        component={renderInput}
                        label=""
                        placeholder={localized(
                            'onboard.business_industry_other_placeholder',
                            'Please input the nature of business'
                        )}
                        validate={[formValidations.required]}
                        onBlur={this.clearOnBlur}
                    />
                )}*/}

                <Field
                    name="business_trade_name"
                    component={renderInput}
                    label={localized(
                        'onboard.business_trade_name',
                        'Business Trading Name'
                    )}
                    placeholder=" "
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                />
                {sceneOnline && (
                    <Field
                        name="website"
                        component={renderInput}
                        label={localized('onboard.website', 'Website address')}
                        placeholder=" "
                        validate={[formValidations.required]}
                        onBlur={this.clearOnBlur}
                    />
                )}
                {/*{sceneOnline && (
                    <div>
                        <p>
                            {localized(
                                'onboard.chose_plugins',
                                'I would like to integrate WeChat Pay & Alipay'
                            )}
                        </p>
                        {pluginsMap.map((item, index) => (
                            <Field
                                key={index}
                                name={item.name}
                                component={renderCheckbox}
                                label={item.label}
                                className="col-sm-4 padding-bottom--none"
                            />
                        ))}
                        <p style={{clear: 'both'}}/>

                        {plugin_other && (
                            <Field
                                name="plugin_other_name"
                                component={renderInput}
                                hideLabel={true}
                                placeholder={localized(
                                    'onboard.plugin_other_name.placehoder',
                                    'Please input the name of plugin'
                                )}
                                validate={[formValidations.required]}
                                onBlur={this.clearOnBlur}
                            />
                        )}
                    </div>
                )}*/}

                {company_type === 'private' && sceneOffline && (
                    <FieldArray
                        id="store_pics"
                        name="store_pics"
                        component={FilePicture}
                        rerenderOnEveryChange={true}
                        label={localized(
                            'onboard.store_pics',
                            'Upload Photos for Business (Both exterior and interior)'
                        )}
                        footer={localized(
                            'onboard.pics.footer',
                            'File types: JPG, PNG, PDF, maximum 10M.'
                        )}
                        onBlur={this.clearOnBlur}
                        accept={'image/jpeg,image/png,application/pdf'}
                        validate={[formValidations.required]}
                        min={2}
                        max={5}
                    />
                )}
                <h4>
                    {this.indexOf('company')}.{' '}
                    {localized('onboard.title.company', 'Company Details')}
                </h4>
                <Field
                    name="country"
                    component={renderSelect}
                    options={countryMap}
                    label={localized('onboard.country', 'Country')}
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                />
                <Field
                    name="registered_name"
                    component={renderInput}
                    label={localized('onboard.registered_name', 'Company Legal Name')}
                    placeholder=" "
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlurRegisterName}
                    onChange={this.changeRegisteredName}
                    autoComplete="off"
                >
                    {searchType === 'registered_name' &&
                    this.renderSearchList(searchList)}
                </Field>

                <Field
                    name="registered_no"
                    component={renderInput}
                    label={localized(
                        'onboard.registered_no',
                        'Company Registration Number'
                    )}
                    placeholder=" "
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                    onChange={this.changeRegisteredNumber}
                >
                    {searchType === 'registered_no' && this.renderSearchList(searchList)}
                </Field>
                <p>{localized('onboard.company.address', 'Business Address')}</p>
                <Field
                    name="street"
                    component={renderInput}
                    label={localized('onboard.street', 'Street Address')}
                    placeholder=" "
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                />
                <Field
                    name="district"
                    component={renderInput}
                    label={localized('onboard.district', 'Address Line 2')}
                    placeholder=" "
                    onBlur={this.clearOnBlur}
                />
                <div className="row">
                    <Field
                        name="city"
                        className="col-sm-6"
                        component={renderInput}
                        label={localized('onboard.city', 'City')}
                        placeholder=" "
                        validate={[formValidations.required]}
                        onBlur={this.clearOnBlur}
                    />
                    <Field
                        name="zip"
                        className="col-sm-6"
                        component={renderInput}
                        label={localized('onboard.zip', 'Zip/Postal Code')}
                        placeholder=" "
                        validate={[formValidations.required]}
                        onBlur={this.clearOnBlur}
                    />
                </div>
                {company_type === 'private' && (
                    <div className="row">
                        <FieldArray
                            id="address_pics"
                            name="address_pics"
                            labelRef={div => {
                                this.companyIdPicsDiv = div;
                            }}
                            labelHeight={labelHeight}
                            component={FilePicture}
                            rerenderOnEveryChange={true}
                            label={localized(
                                'onboard.company.address_pics',
                                'Upload Proof of Physical Business Address'
                            )}
                            footer={localized(
                                'onboard.pics.footer',
                                'File types: JPG, PNG, PDF, maximum 10M.'
                            )}
                            footer2={localized(
                                'onboard.address_pics.footer2',
                                'Proof of Address: bank statement or utility bill (valid within the latest three months)'
                            )}
                            onBlur={this.clearOnBlur}
                            accept={'image/jpeg,image/png,application/pdf'}
                            validate={[formValidations.required]}
                            className="col-sm-6"
                        />
                        <FieldArray
                            id="certificate_pics"
                            name="certificate_pics"
                            labelRef={div => {
                                this.companyAddressPicsDiv = div;
                            }}
                            labelHeight={labelHeight}
                            component={FilePicture}
                            rerenderOnEveryChange={true}
                            label={localized(
                                'onboard.company.centificate',
                                'Upload Company Certificate'
                            )}
                            footer={localized(
                                'onboard.pics.footer',
                                'File types: JPG, PNG, PDF, maximum 10M.'
                            )}
                            onBlur={this.clearOnBlur}
                            accept={'image/jpeg,image/png,application/pdf'}
                            validate={[formValidations.required]}
                            className="col-sm-6"
                        />
                    </div>
                )}

                {company_type === 'private' && (
                    <div>
                        <h4>
                            {this.indexOf('ownership')}.{' '}
                            {localized('onboard.title.owners', 'Company Ownership')}
                        </h4>
                        <p>
                            -{' '}
                            {localized(
                                'onboard.title.owners.tips',
                                'Please list all shareholders who own 25% or more of the company.'
                            )}
                        </p>
                        <FieldArray name="owners" component={this.renderOwner}/>

                        {owners.length < 4 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-primary btn-action btn-add"
                                onClick={this.addDirector}
                            >
                                <div className="button-icon">{icons.add}</div>
                                {localized('onboard.owners.add', 'ADD Shareholder')}
                            </button>
                        )}
                    </div>
                )}

                <h4>
                    {this.indexOf('bank')}.{' '}
                    {localized('onboard.title.bank', 'Business Banking Details')}
                </h4>
                <Field
                    name="settle_bank_account_name"
                    component={renderInput}
                    label={localized('onboard.bank_accont_name', 'Account Name')}
                    placeholder=" "
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                />
                <Field
                    name="settle_bank_name"
                    component={renderInput}
                    label={localized('onboard.bank_name', 'Bank Name')}
                    placeholder=" "
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                />
                <Field
                    name="settle_bank_no"
                    component={renderInput}
                    label={localized('onboard.bank_no', 'Bank Account Number')}
                    placeholder=" "
                    validate={[formValidations.required]}
                    onBlur={this.clearOnBlur}
                    normalize={normalizeBankAccount(CURRENCIES_CODE_NUMBER[currency])}
                />

                <FieldArray name="settle_emails" component={this.renderSettleEmails}/>

                <button
                    type="button"
                    className="btn btn-sm btn-primary btn-action btn-add"
                    onClick={this.addBankEmail}
                >
                    <div className="button-icon">{icons.add}</div>
                    {localized('onboard.contact_email.add', 'ADD Email')}
                </button>
                {/*<p>
                    {localized('onboard.settle_method', 'Settlement/Withdrawal method')}
                </p>
                <div className="row">
                    <Field
                        name="settle_method"
                        component={renderRadio}
                        className="col-sm-3"
                        radioValue="manual"
                        id="settle_method_manual"
                        label={localized('onboard.settle_manual', 'Manually')}
                        validate={[formValidations.required]}
                    />
                    <Field
                        name="settle_method"
                        component={renderRadio}
                        radioValue="auto"
                        className="col-sm-3"
                        id="settle_method_auto"
                        label={localized('onboard.settle_auto', 'Automatic')}
                        validate={[formValidations.required]}
                        showError={false}
                    />
                </div>

                {settle_method === 'auto' && (
                    <div>
                        <Field
                            name="settle_time"
                            component={renderSelect}
                            options={times}
                            label={localized(
                                'onboard.settle_auto.time',
                                'Prefer settlement cut off time'
                            )}
                            placeholder=" "
                            validate={[formValidations.required]}
                            onBlur={this.clearOnBlur}
                        />
                        <p className="margin-bottom-30">
                            {localized(
                                'settle_time.tips',
                                'Transactions before 3pm NZT settled T+1. Transactions after 3pm settled T+2.'
                            )}
                        </p>
                    </div>
                )}*/}
                <FieldArray
                    id="settle_pics"
                    name="settle_pics"
                    component={FilePicture}
                    rerenderOnEveryChange={true}
                    label={localized('onboard.settle_pics', 'Upload Bank statement')}
                    footer={localized(
                        'onboard.pics.footer',
                        'File types: JPG, PNG, PDF, maximum 10M.'
                    )}
                    // validate={[formValidations.required, formValidations.minLength(1, 'Photos')]}
                    onBlur={this.clearOnBlur}
                    accept={'image/jpeg,image/png,application/pdf'}
                    validate={[formValidations.required]}
                />

                {/*<h4>
                    {company_type === 'private' ? 6 : 5}.{' '}
                    {localized('onboard.title.fee', 'Fees')}
                </h4>
                <Field
                    name="who_pay_fee"
                    component={renderSelect}
                    label={localized('onboard.who_pay_fee', 'Merchant Service Fee')}
                    validate={[formValidations.required]}
                    options={[
                        {
                            text: localized(
                                'onboard.who_pay_fee.merchant',
                                'Merchant covers'
                            ),
                            value: 'merchant'
                        },
                        {
                            text: localized('onboard.who_pay_fee.customer', 'Payer covers'),
                            value: 'customer'
                        }
                    ]}
                    placeholder=" "
                    onBlur={this.clearOnBlur}
                />
                <div className="form-group">
                    <label className="control-label">
                        {localized('onboard.withdrawal_fee', 'Withdrawal Fee')}
                    </label>
                    <input
                        className="form-control"
                        readOnly={true}
                        value={localized(
                            'onboard.withdrawal_fee.free',
                            'Free (Local withdrawals)'
                        )}
                    />
                </div>
                <div className="form-group">
                    <label className="control-label">
                        {localized('onboard.account_fee', 'Account Setup Fee')}
                    </label>
                    <input
                        className="form-control"
                        readOnly={true}
                        value={localized('onboard.fee.free', 'Free')}
                    />
                </div>
                <div className="form-group">
                    <label className="control-label">
                        {localized('onboard.fee.platform', 'Payment System Monthly Fee')}
                    </label>
                    <input
                        className="form-control"
                        readOnly={true}
                        value={localized('onboard.fee.free', 'Free')}
                    />
                </div>*/}

                {/*{sceneOffline && (
                    <div>
                        <h4>
                            {this.indexOf('materials')}.{' '}
                            {localized(
                                'onboard.title.meterial',
                                'Would you like some related marketing materials of WeChat & Alipay?'
                            )}
                        </h4>
                        <div className="row">
                            <Field
                                name="materials_need"
                                component={renderRadio}
                                className="col-sm-3"
                                radioValue={'yes'}
                                label={localized('onboard.meterial.need', 'Yes')}
                                validate={[formValidations.required]}
                            />
                            <Field
                                name="materials_need"
                                component={renderRadio}
                                className="col-sm-3"
                                radioValue={'no'}
                                label={localized('onboard.meterial.no_need', 'No')}
                                validate={[formValidations.required]}
                            />
                        </div>

                        {materials_need === 'yes' && (
                            <Field
                                name="materials_address_same"
                                component={renderCheckbox}
                                label={localized(
                                    'onboard.meterial.set_address',
                                    'Same as the Address for Service'
                                )}
                                className="padding-bottom--none"
                            />
                        )}

                        {materials_need === 'yes' &&
                        !materials_address_same && (
                            <div>
                                <Field
                                    name="materials_address.street"
                                    component={renderInput}
                                    label={localized('onboard.street', 'Street Address')}
                                    placeholder=" "
                                    validate={[formValidations.required]}
                                    onBlur={this.clearOnBlur}
                                />
                                <Field
                                    name="materials_address.district"
                                    component={renderInput}
                                    label={localized('onboard.district', 'Address Line 2')}
                                    placeholder=" "
                                    onBlur={this.clearOnBlur}
                                />
                                <div className="row">
                                    <Field
                                        name="materials_address.city"
                                        className="col-sm-6"
                                        component={renderInput}
                                        label={localized('onboard.city', 'City')}
                                        placeholder=" "
                                        validate={[formValidations.required]}
                                        onBlur={this.clearOnBlur}
                                    />
                                    <Field
                                        name="materials_address.zip"
                                        className="col-sm-6"
                                        component={renderInput}
                                        label={localized('onboard.zip', 'Zip/Postal Code')}
                                        placeholder=" "
                                        validate={[formValidations.required]}
                                        onBlur={this.clearOnBlur}
                                    />
                                </div>
                                <Field
                                    name="materials_address.country"
                                    component={renderSelect}
                                    options={countryMap}
                                    label={localized('onboard.country', 'Country')}
                                    validate={[formValidations.required]}
                                    onBlur={this.clearOnBlur}
                                />
                            </div>
                        )}
                    </div>
                )}*/}

                {/*<h4>
                    {this.indexOf('learn_more')}.{' '}
                    {localized(
                        'onboard.title.learn_more',
                        'I would like to know more about (optional)'
                    )}
                </h4>
                <Field
                    name="learn_more_wechat"
                    component={renderCheckbox}
                    label={localized(
                        'onboard.learn_more.wechat',
                        'WeChat Official Account Application'
                    )}
                    className="padding-bottom--none"
                />
                <Field
                    name="learn_more_alipay"
                    component={renderCheckbox}
                    label={localized(
                        'onboard.learn_more.alipay',
                        'Alipay Discovery platform (optional)'
                    )}
                />*/}

                {/*<h4>
                    {this.indexOf('know_from')}.{' '}
                    {localized(
                        'onboard.know_from',
                        'How did you hear of Latipay? (optional)'
                    )}
                </h4>
                <Field
                    name="from_social"
                    component={renderSelect}
                    options={socialNetworkMap}
                    hideLabel={true}
                    onBlur={this.clearOnBlur}
                />

                {from_social === 'Latipay Merchant' && (
                    <Field
                        name="from_merchant"
                        component={renderInput}
                        label=""
                        hideLabel={true}
                        placeholder={localized(
                            'onboard.know_from.merchant.placeholder',
                            'Please list the name'
                        )}
                        validate={[formValidations.required]}
                        onBlur={this.clearOnBlur}
                    />
                )}*/}

                {/*<h4>
                    {this.indexOf('requirement')}.{' '}
                    {localized('onboard.title.requirement', 'Others (optional)')}
                </h4>
                <p>
                    {localized(
                        'onboard.title.requirement.tips',
                        'If you have any special requirement, please leave us a message.'
                    )}
                </p>
                <Field
                    name="notes"
                    className="notes form-control"
                    component="textarea"
                />*/}

                <p>
                    {localized('onboard.time', 'Application Date')}
                    ：{getDateDMYDisplay()}
                </p>
                <p>
                    *{localized(
                    'onboard.terms.tips',
                    ' By clicking submit,  you have agree to our '
                )}
                    <a className="link" target="__blank" href="/terms_conditions.pdf">
                        {localized('onboard.terms', 'Terms & Conditions')}
                    </a>
                    {', '}
                    <a
                        className="link"
                        target="__blank"
                        href="/Enterprise_Merchant_Agreement.pdf"
                    >
                        {localized('onboard.agreement', 'Enterprise Merchant Agreement.')}
                    </a>
                </p>
                <div className="row onboard-footers">
                    <div className="col-md-6 col-md-offset-3 col-sm-12">
                        <button
                            type="submit"
                            className="btn btn-primary btn-form"
                            disabled={submitting}
                            onClick={this.submitBtnClicked}
                        >
                            {localized('onboard.submit', 'Submit')}
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.sceneOnline && !values.sceneOffline) {
        errors.sceneOffline = 'Required';
    }

    return errors;
};

const selector = formValueSelector('OnboardFull');

export default connect(state => {
    const obj = {
        owners: selector(state, 'owners') || [{}],
        sceneOnline: selector(state, 'sceneOnline'),
        sceneOffline: selector(state, 'sceneOffline'),
        settle_method: selector(state, 'settle_method'),
        plugin_other_name: selector(state, 'plugin_other_name'),
        business_industry: selector(state, 'business_industry'),
        business_industry_other: selector(state, 'business_industry'),
        materials_need: selector(state, 'materials_need'),
        materials_address_same: selector(state, 'materials_address_same'),
        from_social: selector(state, 'from_social'),
        settle_bank_no: selector(state, 'settle_bank_no'),
        currency: selector(state, 'currency'),
        country: selector(state, 'country')
    };

    pluginsMap.forEach(({name}) => {
        obj[name] = selector(state, name);
    });

    obj.searchType = state.nzbn.searchType;
    obj.searchList = state.nzbn.list;
    obj.searchCompany = state.nzbn.company;

    return obj;
}, nzbnActions)(
    reduxForm({
        form: 'OnboardFull',
        initialValues: {
            owners: [
                {
                    identity_type: 'passport'
                }
            ], //for validator everyElement
            settle_emails: ['']

            //   //TODO
            // business_industry: 'Commercial trading',
            // business_trade_name: '1',
            // contact_email: '1',
            // company_type: 'private',
            // scene: ['online', 'offline'],
            // currency: 'NZD',
            // business_industry: 'Commercial trading',
            // business_trade_name: '阿斯顿发',
            // website: 'rr23423e',
            // plugins: [],
            // registered_name: 'asdfasdf',
            // registered_no: '32423',
            // street: 'asdfadfsf',
            // district: 'Otahuhu',
            // city: 'Auckland',
            // zip: '1062',
            // country: 'New Zealand',
            // contact_first_name: 'asdf',
            // contact_family_name: 'asdf',
            // contact_phone: '12112',
            // contact_email: 'asdfjl@d.omc',
            // settle_bank_account_name: 'a23408908dsf',
            // settle_bank_name: 'ASB',
            // settle_bank_no: '33232201',
            // settle_emails: ['info@asdfad.comz'],
            // settle_method: 'manual',
            // who_pay_fee: 'merchant',
            // learn_more_wechat: 'true',
            // learn_more_alipay: 'true',
            // from_social: 'Latipay Wechat Official Account',
            // nzbn: '121',
            // materials_need: 'no',
            // materials_address_same: false,
            //
            // settle_pics: [
            //   {
            //     name: 'settle_pics',
            //     url:
            //       'https://traderdoc.oss-cn-hongkong.aliyuncs.com/bankaccount-doc/1524448525766-3422-189414/Screen Shot 2018-04-21 at 10.36.38 PM.png',
            //     uploading: false
            //   }
            // ],
            // address_pics: [
            //   {
            //     name: 'address_pics',
            //     url:
            //       'https://traderdoc.oss-cn-hongkong.aliyuncs.com/bankaccount-doc/1524448525766-3422-189414/Screen Shot 2018-04-21 at 10.36.38 PM.png',
            //     uploading: false
            //   }
            // ],
            // store_pics: [
            //   {
            //     name: '',
            //     url:
            //       'https://traderdoc.oss-cn-hongkong.aliyuncs.com/bankaccount-doc/1524448525766-3422-189414/Screen Shot 2018-04-21 at 10.36.38 PM.png',
            //     uploading: false,
            //     hasd: 'adfasdf'
            //   },
            //   {
            //     name: 'store_pics',
            //     url:
            //       'https://traderdoc.oss-cn-hongkong.aliyuncs.com/bankaccount-doc/1524448525766-3422-189414/Screen Shot 2018-04-21 at 10.36.38 PM.png',
            //     uploading: false,
            //     hasdasd: 'adfasdf'
            //   }
            // ],
            // certificate_pics: [
            //   {
            //     name: 'certificate',
            //     url:
            //       'https://traderdoc.oss-cn-hongkong.aliyuncs.com/bankaccount-doc/1524448525766-3422-189414/Screen Shot 2018-04-21 at 10.36.38 PM.png',
            //     uploading: false
            //   }
            // ],
            // sceneOffline: true,
            // owners: [
            //   {
            //     city: 'Tuakau',
            //     country: 'New Zealand',
            //     district: 'Tuakau',
            //     identity_type: 'passport',
            //     name: 'Susanne CRAWFORD',
            //     street: ' 364 Dominion Road',
            //     type: 'director',
            //     birthday: '2012-10-12',
            //     zip: '2121',
            //     identity_no: '1221',
            //     address_pics: [
            //       {
            //         name: 'certificate',
            //         url:
            //           'https://traderdoc.oss-cn-hongkong.aliyuncs.com/bankaccount-doc/1524448525766-3422-189414/Screen Shot 2018-04-21 at 10.36.38 PM.png',
            //         uploading: false
            //       }
            //     ],
            //     id_pics: [
            //       {
            //         name: 'certificate',
            //         url:
            //           'https://traderdoc.oss-cn-hongkong.aliyuncs.com/bankaccount-doc/1524448525766-3422-189414/Screen Shot 2018-04-21 at 10.36.38 PM.png',
            //         uploading: false
            //       }
            //     ]
            //   }
            // ]
        },
        validate
    })(OnboardFullForm)
);
