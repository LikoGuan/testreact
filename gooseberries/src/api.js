import axios from 'axios';
import config from './config';
import { actions as authActions } from './redux/ducks/auth';
import history from './history';
import { makeForm } from './utils';
const store = require('./redux/store').default;

// Instantiate axios
const _axios = axios.create({
  baseURL: config.backend.base
});
const _axios_gateway = axios.create({
  baseURL: config.backend.gateway
});
// Add a request interceptor
_axios.interceptors.request.use(
  config => {
    // Add JWT  to http request header
    const { jwt, userId } = store.getState().auth;
    config.headers.common.Authorization = jwt;
    config.headers.common['X-USER-ID'] = userId;
    return config;
  },
  error => Promise.reject(error)
);

_axios.interceptors.response.use(
  // response
  response => response,
  // error
  error => {
    if (error.response && 401 === error.response.status) {
      // JWT not valid or expired
      store.dispatch(authActions.AuthTokenInvalid());
      history.push('/', { from: history.location });
    }
    return Promise.resolve(error.response);
  }
);

// APIs

export const me = {
  login: credential => _axios.post('/org/account/login', credential),
  profile: () => _axios.get('/org/account/profile'),
  redirectCORSToMerchant: paydata =>
    makeForm(
      `${config.backend.merchant}/fromspotpay?jwt=${paydata.jwt}&userId=${
        paydata.userId
      }`,
      {}
    )
};

export const wallet = {
  list: () => _axios.get('/org/wallets'),
  rateAndCharge: params => () =>
    _axios.get(`/org/barcode_margin_rate/${params.wallet_id}`, {
      params: {
        user_id: params.user_id
      }
    })
};
export const transaction = {
  init: paydata => _axios.post('/v2/transaction', paydata),
  gateway: nonce => _axios.get(`/v2/gatewaydata/${nonce}`),
  query: orderId => _axios.post('/v2/queryOrder', { orderId }),

  payBarcode: data => _axios.post('/org/barcode', data)
};
export const payment = {
  qrcode: nonce => _axios_gateway.get(`/pay/${nonce}`)
};
export default {
  me,
  wallet,
  transaction,
  payment
};
