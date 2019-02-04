export const CURRENCIES = {
  1: { code: 'NZD', sign: '$' },
  2: { code: 'AUD', sign: '$' },
  3: { code: 'USD', sign: '$' },
  4: { code: 'SGD', sign: '$' },
  5: { code: 'CNY', sign: '¥' },
  6: { code: 'GBP', sign: '£' },
  7: { code: 'EUR', sign: '€' },
  8: { code: 'AED', sign: '' }
};

export const CURRENCIES_CODE_NUMBER = Object.keys(CURRENCIES).reduce(
  (obj = {}, item) => {
    obj[CURRENCIES[item].code] = item;
    return obj;
  },
  {}
);

export const CURRENCIES_CODE_SIGN = Object.keys(CURRENCIES).reduce(
  (obj = {}, item) => {
    obj[CURRENCIES[item].code] = CURRENCIES[item].sign;
    return obj;
  },
  {}
);

export const showBarcode = orgId => orgId !== 27 && orgId !== 155;
