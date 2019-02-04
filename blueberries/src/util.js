import _ from 'lodash';

export function stringToDate(obj, key) {
  // if lowercased key contains `date`
  if (key.toLowerCase().indexOf('date') > -1) {
    obj[key] = obj[key] && Date.parse(obj[key]) ? new Date(obj[key]) : '';
  }
}

export function formatDate(timestamp) {
  return !isEmpty(timestamp) ? new Date(timestamp).toLocaleDateString() : '';
}

export function dateToYYYYMMDD(date) {
  if (isEmpty(date)) {
    return '';
  }

  let dateFormatted;
  try {
    dateFormatted = date.toISOString();
  } catch (err) {
    dateFormatted = '';
  }

  return dateFormatted.slice(0, 10);
}

export function traverse(obj, transform) {
  for (let i in obj) {
    if (!!obj[i] && typeof obj[i] === 'object') {
      traverse(obj[i], transform);
    } else {
      transform(obj, i);
    }
  }
  return obj;
}
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function getSourceForAutoComplete(data, isUseLabelsAsKeys, isOptional) {
  let result;
  if (!data) {
    result = {};
  } else if (_.isArray(data)) {
    let source = {};
    data.map(item => {
      source[isUseLabelsAsKeys ? item.label : item.value] = item.label;
      return item;
    });
    result = source;
  } else {
    result = data;
  }
  if (isOptional) {
    result['Any'] = 'Any';
  }
  return result;
}

export function getSourceForDropdown(data, isUseLabelsAsKeys, isOptional) {
  let result;
  if (!data) {
    result = [];
  } else if (isUseLabelsAsKeys) {
    result = data.map(item => ({ label: item.label, value: item.label }));
  } else {
    result = data;
  }
  if (isOptional) {
    result = result.concat({ label: '', value: 'NULL' });
  }
  /*if (result.length===0) {
    throw new Error("Domain for dropdown was empty");
  }*/
  return result;
}

export function stringToBoolean(string) {
  switch (string.toString().toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(string);
  }
}

export function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

export const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};
export function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function getLabel(options = [], val) {
  const find = options.find(({ value }) => value === val);
  if (find) {
    return find.label;
  } else {
    //console.warn("Label not found for "+val);
    return '';
  }
}

export function getValue(options = [], _label) {
  const find = options.find(({ label }) => label === _label);
  if (find) return find.value;
  else return '';
}


export function keyToName(key) {
  const map = {
    createdDate: 'Created date',
    walletName: 'Wallet name',
    merchantId: 'Merchant Id',
    settlementId: 'Settlement Id',
    transactionId: 'Transaction Id',
    amount: 'Amount',
    currency: 'Currency',
    processedDate: 'Processed date',
    status: 'Status',
};

  return map[key];
}