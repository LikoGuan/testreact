import { CURRENCIES } from '../constants';


// XX-XXXX-XXXXXXX-XX
// XX-XXXX-XXXXXXX-XXX
const normalizeBankAccountNZD = (value, previousValue) => {
  const onlyNums = value.replace(/[^\d]/g, '')

  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 2) {
      return onlyNums + '-';
    }
    if (onlyNums.length === 6) {
      return onlyNums.slice(0, 2) + '-' + onlyNums.slice(2);
    }
    if (onlyNums.length === 13) {
      return onlyNums.slice(0, 2) + '-' + onlyNums.slice(2, 6) + '-' + onlyNums.slice(6, 13);
    }
  }

  if (onlyNums.length <= 2) {
    return onlyNums;
  }
  if (onlyNums.length <= 6) {
    return onlyNums.slice(0, 2) + '-' + onlyNums.slice(2);
  }
  if (onlyNums.length <= 13) {
    return onlyNums.slice(0, 2) + '-' + onlyNums.slice(2, 6) + '-' + onlyNums.slice(6, 13);
  }

  const maxLength = Math.min(onlyNums.length, 16);
  return onlyNums.slice(0, 2) + '-' + onlyNums.slice(2, 6) + '-' + onlyNums.slice(6, 13) + '-' + onlyNums.slice(13, maxLength);
}


// XXXXXX-XXXXXXXXX
const normalizeBankAccountAUD = (value, previousValue) => {
  const onlyNums = value.replace(/[^\d]/g, '')
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 6) {
      return onlyNums + '-';
    }
  }

  if (onlyNums.length <= 6) {
    return onlyNums;
  }
  
  return onlyNums.slice(0, 6) + '-' + onlyNums.slice(6);
}

const normalizeBankAccount = (currency) => (value, previousValue) => {
  if (!value || !CURRENCIES[currency]) {
    return value
  }

  let normalize;
  const currencyCode = CURRENCIES[currency].code;

  if (currencyCode === 'NZD') {
    normalize = normalizeBankAccountNZD;
  }else if (currencyCode === 'AUD') {
    normalize = normalizeBankAccountAUD;
  }else {
    return value;
  }

  return normalize(value, previousValue);
}

export default normalizeBankAccount;