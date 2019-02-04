// client api
import axios from 'axios';
import config from '../config';
export const queryOrder = async orderId => {
  const res = await axios.post(config.backend.base + '/v2/queryOrder', {
    orderId
  });
  return res.data;
};

export const makeTransaction = async payload => {
  const { data } = await axios.post(
    config.backend.base + '/v2/transaction',
    payload
  );
  if (data.code === 0) {
    return data;
  } else {
    alert(data.message);
  }
};

export const payInvoice = async (invoiceId, paymentMethod) => {
  const { data } = await axios.post(
    config.backend.base +
      `/v2/transaction/invoice/${invoiceId}/${paymentMethod}`
  );
  if (data.code === 0) {
    return data;
  } else {
    alert(data.message);
  }
};

export const payInvoiceNew = async body => {
  const { data } = await axios.post(
    config.backend.base + '/v2/invoice/payinner',
    body
  );
  if (data.code === 0) {
    return data;
  } else {
    alert(data.message);
  }
};

export const payShopify = async payload => {
  const rep = await axios.post('/shopifyAuth', payload);
  return rep;
};

export const getRate = async payload => {
  const rep = await axios.get(config.backend.base + '/v2/all_rate', {
    params: payload
  });
  return rep;
};

export const postRefund = async payload => {
  const rep = await axios.post(config.backend.base + '/refund', payload);
  return rep;
};

export const postInvoiceRefund = async payload => {
  const rep = await axios.post(
    config.backend.base + '/v2/invoice/refund',
    payload
  );
  return rep;
};

export const postInvoice = async payload => {
  const rep = await axios.post(config.backend.base + '/v2/invoice', payload);
  return rep;
};

export const getInvoice = async payload => {
  const rep = await axios.get(config.backend.base + '/v2/invoice', {
    params: payload
  });
  return rep;
};

export const getInvoices = async payload => {
  const resp = await axios.get(config.backend.base + '/v2/invoices', {
    params: payload
  });
  return resp.data;
};

export const deleteInvoice = async payload => {
  const rep = await axios.delete(config.backend.base + '/v2/invoice', {
    data: payload
  });
  return rep;
};

export const log = data => {
  axios.post('/log', data);
};
