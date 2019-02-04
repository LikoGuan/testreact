const DEPLOY_ENV = process.env.REACT_APP_DEPLOY_ENV;

const BACKENDS = {
  prod: 'https://api-trader.latipay.net',
  staging: 'https://api-trader-staging.latipay.net',
  dev: 'https://api-trader-dev.latipay.net',
  localhost: 'http://localhost:5000',
};

export default {
  backend: {
    base: BACKENDS[DEPLOY_ENV] || BACKENDS.dev,
  },
};
