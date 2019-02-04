export const BANKS = {
  3: '招商银行',
  4: '建设银行',
  9: '工商银行',
  28: '民生银行卡',
  33: '兴业银行卡',
  43: '农业银行',
  44: '广东发展银行',
  50: '北京银行',
  59: '中国邮政',
  67: '交通银行',
  69: '浦发银行',
  74: '光大银行',
  75: '北京农村商业银行',
  83: '渤海银行',
  84: '中信银行',
  85: '中国银行'
};

export const BANKS_ARRAY = [
  { id: 3, name: '招商银行' },
  { id: 4, name: '建设银行' },
  { id: 9, name: '工商银行' },
  { id: 28, name: '民生银行卡' },
  { id: 33, name: '兴业银行卡' },
  { id: 43, name: '农业银行' },
  { id: 44, name: '广东发展银行' },
  { id: 50, name: '北京银行' },
  { id: 59, name: '中国邮政' },
  { id: 67, name: '交通银行' },
  { id: 69, name: '浦发银行' },
  { id: 74, name: '光大银行' },
  { id: 75, name: '北京农村商业银行' },
  { id: 83, name: '渤海银行' },
  { id: 84, name: '中信银行' },
  { id: 85, name: '中国银行' }
];

export const CURRENCIES = {
  1: { code: 'NZD', sign: '$' },
  2: { code: 'AUD', sign: '$' },
  3: { code: 'USD', sign: '$' },
  4: { code: 'SGD', sign: '$' },
  5: { code: 'CNY', sign: '¥' },
  6: { code: 'GBP', sign: '£' },
  7: { code: 'EUR', sign: '€' }
};

export const CURRENCIES_CODE_SIGN = Object.keys(CURRENCIES).reduce(
  (obj = {}, item) => {
    obj[CURRENCIES[item].code] = CURRENCIES[item].sign;
    return obj;
  },
  {}
);
