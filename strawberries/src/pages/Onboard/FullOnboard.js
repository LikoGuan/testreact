import React, { Component } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';

import FullForm, { pluginsMap } from '../../forms/OnboardFull';
import { actions as ossActions } from '../../redux/ducks/ossTemp';

import { messages, locale } from '../../i18n';

import api from '../../api';
import history from '../../history';

const localized = (key, message) => messages[locale][key] || message;

export class FullOnboard extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    this.props.fetchOSS();
  }

  async onSubmit(form) {
    const body = { ...form };

    delete body.sceneOnline;
    delete body.sceneOffline;
    delete body.plugin_other_name;

    pluginsMap.forEach(item => {
      delete body[item.name];
    });

    if (body.company_type === 'public') {
      delete body.store_pics;
      delete body.address_pics;
      delete body.certificate_pics;
      delete body.owners;
    }

    if (body.business_industry === 'Others') {
      body.business_industry = body.business_industry_other;
    }

    //TODO validate
    //check image is uploading
    //store_pics address_pics certificate_pics settle_pics owners.id_pics owners.address_pics
    const {
      store_pics = [],
      address_pics = [],
      certificate_pics = [],
      settle_pics = [],
      owners: { id_pics = [], address_pics: ownerAddrssPics = [] }
    } = body;

    let isUploading = false;
    [
      store_pics,
      address_pics,
      certificate_pics,
      settle_pics,
      id_pics,
      ownerAddrssPics
    ].forEach(pics => {
      pics.forEach(item => {
        if (!isUploading && item.file && !item.url) {
          isUploading = true;
        }
      });
    });

    if (isUploading) {
      alert(
        localized(
          'onboard.submit_latter',
          'Picture is uploading, please submit later.'
        )
      );
      return;
    }

    const { data } = await api.onboard.postFull(body);

    if (data.code === 0) {
      Alert.success('Success');

      history.replace('/full-onboard/success');
    } else {
      Alert.warning('Server error, please try it later.');
    }
  }

  gotoHome = event => {
    event.preventDefault();

    history.replace('/');
    window.location.reload();
  };

  render() {
    const { location } = this.props;

    let dom = <p>Not Found</p>;
    if (
      location.pathname === '/full-onboard' ||
      location.pathname === '/full-onboard/' ||
      location.pathname === '/join' ||
      location.pathname === '/join/'
    ) {
      dom = (
        <FullForm onSubmit={this.onSubmit} location={this.props.location} />
      );
    } else if (location.pathname.indexOf('/full-onboard/success') !== -1) {
      dom = (
        <div style={{ width: '80%', margin: '50px auto' }}>
          <p>
            {localized(
              'onboard.success',
              'Thank you for your Latipay Merchant Application, we will contact you in shortly. If you have any further questions, please feel free to contact us by.'
            )}
          </p>
          <p>
            {localized('mail', 'Email')}:{' '}
            <a className="link" href="mailto:customerservice@latipay.net">
              customerservice@latipay.net
            </a>
          </p>
          <p>
            {localized('landline', 'Landline')}:{' '}
            <a className="link" href="tel:0800-00-3114">
              0800 00 3114
            </a>
          </p>
          <p>
            <a className="link" href="/" onClick={this.gotoHome}>
              {localized('onboard.goto_home', 'Go to Home')}
            </a>
          </p>
        </div>
      );
    }

    return (
      <div className="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 onboard-full-container">
        {dom}
      </div>
    );
  }
}
export default connect(state => state, ossActions)(FullOnboard);
