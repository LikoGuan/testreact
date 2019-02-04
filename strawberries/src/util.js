import qs from 'qs';
import { CURRENCIES } from './constants';
import numeral from 'numeral';

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
export function download(filename, text) {
  if (!window.download) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  } else {
    window.download(text, filename, 'text/plain');
  }
}

export function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
export function guid() {
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  );
}

export function hasParameter(props, key, value) {
  const search = props.location.search;
  const trim = search
    .split('?')
    .filter(item => item)
    .slice(0)
    .join('?');
  const parames = qs.parse(trim);

  const target = parames[key];

  return target === value;
}

export function moneyString(amount, currency) {
  const { sign = '', code = '' } = CURRENCIES[currency] || {};
  return sign + numeral(Math.abs(amount)).format('0,0.00') + ' ' + code;
}

export function moneyStringWithCode(amount, currencyCode) {
  const target = Object.keys(CURRENCIES).find(number => {
    let obj = CURRENCIES[number];
    return obj.code === currencyCode;
  });

  const sign = target ? CURRENCIES[target].sign : '';
  return `${sign}${numeral(Math.abs(amount)).format('0,0.00')} ${currencyCode}`;
}

const dateStringFormat = number => (number >= 10 ? number : `0${number}`);
export const getDateTimeDisplay = date =>
  date
    ? `${date.getFullYear()}-${dateStringFormat(
        date.getMonth() + 1
      )}-${dateStringFormat(date.getDate())} ${dateStringFormat(
        date.getHours()
      )}:${dateStringFormat(date.getMinutes())}:${dateStringFormat(
        date.getSeconds()
      )}`
    : '';

export const getDateDisplay = date =>
  date
    ? `${dateStringFormat(date.getMonth() + 1)}-${dateStringFormat(
        date.getDate()
      )} ${dateStringFormat(date.getHours())}:${dateStringFormat(
        date.getMinutes()
      )}`
    : '';

export const getDateDMYDisplay = () => {
  const date = new Date();
  return `${dateStringFormat(date.getDate())}/${dateStringFormat(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};

export const isOnboardOrSupport = () => {
  const href = window.location.href;
  return (
    href.indexOf('/onboard') !== -1 ||
    href.indexOf('/join') !== -1 ||
    href.indexOf('/support') !== -1
  );
};

export const isOnboard = () => {
  const href = window.location.href;
  return href.indexOf('/onboard') !== -1 || href.indexOf('/join') !== -1;
};
