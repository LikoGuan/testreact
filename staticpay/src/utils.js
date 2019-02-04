export const returnUrl = `${window.location.origin}/static_qr_confirmation`;

export const genPayData2 = (form, extra) => {
  const { user_id, wallet_id, payment_method, currency } = extra;

  const payload = {
    amount: form.amount,

    user_id,
    wallet_id,
    payment_method,

    back_page_url: window.location.origin + window.location.pathname,
    return_url: returnUrl,
    is_staticpay: '1' //TODO
  };

  const reference = form.reference;
  if (reference && reference.trim().length > 0) {
    payload.reference = reference;
  }

  if (currency) {
    payload.pay_currency = currency;
  }

  return payload;
};

export const isWexin = /micromessenger/.test(navigator.userAgent.toLowerCase());

const dateStringFormat = number => (number >= 10 ? number : `0${number}`);
export const getDateDisplay = date =>
  date
    ? `${date.getFullYear()}-${dateStringFormat(
        date.getMonth() + 1
      )}-${dateStringFormat(date.getDate())} ${dateStringFormat(
        date.getHours()
      )}:${dateStringFormat(date.getMinutes())}:${dateStringFormat(
        date.getSeconds()
      )}`
    : '';

export const makeForm = (formContainer, endpoint, payload) => {
  const f = document.createElement('form');
  f.setAttribute('method', 'post');
  f.setAttribute('action', endpoint);
  f.setAttribute('style', 'display:none');

  Object.keys(payload).forEach(key => {
    const i = document.createElement('input');
    i.setAttribute('type', 'text');
    i.setAttribute('name', key);
    i.setAttribute('value', payload[key]);
    f.appendChild(i);
  });

  formContainer.appendChild(f);
  f.submit();
};
