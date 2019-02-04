const DEPLOY_ENV = process.env.REACT_APP_DEPLOY_ENV;

const BACKENDS = {
    prod: 'https://api.latipay.net',
    staging: 'https://api-staging.latipay.net',
    dev: 'https://api-staging.latipay.net'
};

const ADMIN_API = {
    prod: 'https://api-admin.latipay.net',
    staging: 'https://api-admin-staging.latipay.net',
    dev: 'http://localhost:10000'
};

const nzbnConfig = {
    base: {
        prod: 'https://api.business.govt.nz',
        staging: 'https://sandbox.api.business.govt.nz'
    },
    authorization: {
        staging: '645704038c307a0afac1d57aa82941ae',
        prod: 'b9a2d07b99a254898e4e1fa2e037d91c'
    }
};

export default {
    backend: {
        base: BACKENDS[DEPLOY_ENV] || BACKENDS.dev,
        admin: ADMIN_API[DEPLOY_ENV] || ADMIN_API.dev,
    },
    nzbn: {
        base: nzbnConfig.base[DEPLOY_ENV] || nzbnConfig.base.staging,
        authorization:
        nzbnConfig.authorization[DEPLOY_ENV] || nzbnConfig.authorization.staging
    },
    raven: {
        DSN: 'https://34fb436f255e4ad8bcd246c90ef2d889@sentry.io/171015'
    }
};
