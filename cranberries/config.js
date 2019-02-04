const DEPLOY_ENV = process.env.DEPLOY_ENV;

const BACKENDS = {
  prod: 'https://api.latipay.net',
  staging: 'https://api-staging.latipay.net',
  dev: 'https://api-dev.latipay.net'
};

const SPOT_HOST = {
  prod: 'https://spotpay.latipay.net',
  staging: 'https://spotpay-staging.latipay.net',
  dev: 'https://spotpay-dev.latipay.net'
};

const MERCHANT_HOST = {
  prod: 'https://merchant.latipay.net',
  staging: 'https://merchant-staging.latipay.net',
  dev: 'https://merchant-dev.latipay.net'
};

const SHOPIFY_BACKENDS = {
  prod: 'https://shopify.latipay.net',
  staging: 'https://shopify-staging.latipay.net'
};

const FLO2CASH_HOST = {
  prod: 'secure.flo2cash.co.nz',
  staging: 'sandbox.flo2cash.com'
};

const FLO2CASH_ENV = {
  prod: 'prod',
  staging: 'sandbox'
};

const spotpayHost = SPOT_HOST[DEPLOY_ENV] || SPOT_HOST.dev;

module.exports = {
  backend: {
    base: BACKENDS[DEPLOY_ENV] || BACKENDS.dev
  },
  shopifyBackend: {
    base: SHOPIFY_BACKENDS[DEPLOY_ENV] || SHOPIFY_BACKENDS.staging
  },
  spotpayHost: spotpayHost,
  staticConfirmation: `${spotpayHost}/static_qr_confirmation`,
  merchantHost: MERCHANT_HOST[DEPLOY_ENV] || MERCHANT_HOST.dev,
  raven: {
    DSN:
      'https://ad932f3dd12a43669c39ae0f5cc3e6fb:b1fd77bd35414fbca8e76183a25937cc@sentry.io/162791'
  },
  flo2cashEnv: FLO2CASH_ENV[DEPLOY_ENV] || FLO2CASH_ENV.staging,
  flo2cashHost: FLO2CASH_HOST[DEPLOY_ENV] || FLO2CASH_HOST.staging
};
