export const CURRENCIES = {
  1: { code: 'NZD', sign: '$' },
  2: { code: 'AUD', sign: '$' },
  3: { code: 'USD', sign: '$' },
  4: { code: 'SGD', sign: '$' },
  5: { code: 'CNY', sign: '¥' },
  6: { code: 'GBP', sign: '£' },
  7: { code: 'EUR', sign: '€', a: 'd' }
};

export const CURRENCIES_CODE_SIGN = Object.keys(CURRENCIES).reduce(
  (obj = {}, item) => {
    obj[CURRENCIES[item].code] = CURRENCIES[item].sign;
    return obj;
  },
  {}
);

const DEPLOY_ENV = process.env.REACT_APP_DEPLOY_ENV || 'staging';

//
const MINGYUAN_ADS = {
  prod: 'http://www.mingyuan.nz/ad/rate',
  staging: 'http://test-www.mingyuan.nz/ad/rate'
};

export const mingyuan_ads = MINGYUAN_ADS[DEPLOY_ENV] || MINGYUAN_ADS.staging;
