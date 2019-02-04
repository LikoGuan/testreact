const REACT_APP_DEPLOY_ENV = process.env.REACT_APP_DEPLOY_ENV || 'dev';

const BACKENDS = {
  prod: 'https://api.latipay.net',
  staging: 'https://api-staging.latipay.net',
  dev: 'https://api-dev.latipay.net',
};
const GATEWAYS = {
  prod: 'https://pay.latipay.net',
  staging: 'https://pay-staging.latipay.net',
  dev: 'https://pay-dev.latipay.net',
};
const MERCHANT = {
  prod: 'https://merchant.latipay.net',
  staging: 'https://merchant-staging.latipay.net',
  dev: 'https://merchant-dev.latipay.net',
};
export default {
  backend: {
    base: BACKENDS[REACT_APP_DEPLOY_ENV],
    gateway: GATEWAYS[REACT_APP_DEPLOY_ENV],
    merchant: MERCHANT[REACT_APP_DEPLOY_ENV],
  },
  raven: {
    DSN: 'https://34fb436f255e4ad8bcd246c90ef2d889@sentry.io/171015',
  },
};
