import axios from "axios";
import config from "./config";
import { actions as authActions } from "./redux/ducks/auth";

// Instantiate axios
const _axios = axios.create({
  baseURL: config.backend.base
});

// for debug
window.$$setBaseURL$$ = url => {
  _axios.defaults.baseURL = url;
};

let _store = null;
// Add a request interceptor
_axios.interceptors.request.use(
  config => {
    // Add JWT  to http request header
    const { jwt, userId } = _store.getState().auth;
    if (jwt) {
      config.headers.common.Authorization = jwt;
      config.headers.common["X-USER-ID"] = userId;
    }
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
      _store.dispatch(authActions.authTokenInvalid());
    }
    return Promise.resolve(error.response);
  }
);

// APIs

export const me = {
  signup: credential => _axios.post("/org/account/register", credential),
  login: credential => _axios.post("/org/account/login", credential),
  profile: () => _axios.get("/org/account/profile"),
  username: form => _axios.post("/org/users/changename", form),

  requestResetPwd: credential =>
    _axios.post("/org/account/reset_password", credential),
  resetPwd: ({ nonce, password }) =>
    _axios.post("/org/account/update_password", {
      nonce,
      password,
      ask: false
    }),
  resetPwdCheckToken: ({ nonce }) =>
    _axios.post("/org/account/update_password", { nonce, ask: true }),
  changePwd: credential =>
    _axios.post("/org/account/resetpassword", credential),
  org: {
    get: () => _axios.get("/org/account/orginfo"),
    update: form => _axios.post("/org/account/orginfo", form)
  },
  activate: nonce => _axios.get(`/org/account/activate/${nonce}`)
};

export const wallets = {
  list: () => _axios.get("/org/wallets"),
  update: (id, form) => _axios.put(`/org/wallets/${id}`, form),
  create: form => _axios.post("/org/wallets", form)
};

export const users = {
  list: () => _axios.get("/org/users"),
  update: (userId, form) => _axios.put(`/org/users/${userId}`, form),
  create: form => _axios.post("/org/users", form),
  delete: userId => _axios.delete(`/org/users/${userId}`),
  disable: (userId, form) => _axios.put(`/org/users/disabled/${userId}`, form),
  email: email => _axios.post("/org/users/resendmail", { email })
};
export const customers = {
  list: () => _axios.get("/org/customers"),
  update: (id, form) => _axios.put(`/org/customers/${id}`, form),
  create: form => _axios.post("/org/customers", form),
  delete: id => _axios.delete(`/org/customers/${id}`)
};
export const drafts = {
  list: params => _axios.get("/org/invoice/drafts", { params }),
  create: form => _axios.post("/org/invoice/drafts", form),
  update: form => _axios.put("/org/invoice/drafts", form),
  duplicate: id => _axios.post(`org/invoice/drafts/dup/${id}`),
  delete: id => _axios.delete(`org/invoice/drafts/${id}`)
};
export const invoices = {
  list: params => _axios.get("/org/invoice", { params }),
  send: form => _axios.post("/org/invoice/send", form),
  resend: (id, form) => _axios.post(`/org/invoice/resend/${id}`, form),
  delete: id => _axios.delete(`/org/invoice/${id}`),
  duplicate: id => _axios.post(`/org/invoice/dup/${id}`),
  share: id => _axios.get(`/org/invoice/share/${id}`)
};
export const coupons = {
  list: params => _axios.get("/org/coupons/list", { params }),
  prepayList: params => _axios.get("/org/pre_coupon/list", { params }),
  redeem: id => _axios.get(`/org/transactions/redeem/${id}`)
};
export const bankaccounts = {
  list: () => _axios.get("/org/bankaccounts"),
  create: form => _axios.post("/org/bankaccounts", form),
  update: (id, form) => _axios.put(`/org/bankaccounts/${id}`, form),
  delete: id => _axios.delete(`/org/bankaccounts/${id}`),
  withdrawSetting: () => _axios.get(`/org/withdraw_setting`)
};

export const withdrawals = {
  list: form => _axios.get("/finance/withdrawalsmoney"),
  create: form => _axios.post("/finance/withdrawalsmoney", form)
};

export const transactions = {
  list: params =>
    _axios.get("/org/transactions", {
      params
    }),
  export: params =>
    _axios.get("/org/transactions/download", {
      params
    }),
  id: id => _axios.get(`/org/transactions/${id}`)
};

export const refunds = {
  update: form => _axios.post("/finance/refunds", form)
};

export const notifications = {
  get: _ => _axios.get("/org/user/notifications"),
  update: form => _axios.post("/org/user/notifications", form)
};

export const constants = {
  permissions: () => _axios.get("/org/permissions"),
  payease: _ => _axios.get("/org/paycompany/payease")
};

const documents = {
  prepare: () => _axios.get("/org/bankaccounts/osskey"),
  tempPrepare: () => _axios.get("/org/temp_osskey"),
  upload: (oss, file, filepath, onUploadProgress) => {
    oss.form.key = filepath;
    var data = new FormData();
    Object.keys(oss.form).forEach(key => {
      data.append(key, oss.form[key]);
    });
    data.append("file", file, file.name);
    return axios.post(oss.host, data, { onUploadProgress: onUploadProgress });
  }
};

export const onboard = {
  postFull: data => _axios.post("/fullversion", data)
};

export const onboardWithSteps = {
  post: data => _axios.post(config.backend.admin + "/common/onboarding", data),
  get: id => _axios.get(config.backend.admin + "/common/onboarding/" + id),
  put: (id, data) =>
    _axios.put(config.backend.admin + "/common/onboarding/" + id, data)
};

const axiosNZ = axios.create({
  baseURL: config.nzbn.base
});
axiosNZ.defaults.headers.common["Authorization"] = `Bearer ${
  config.nzbn.authorization
}`;
axiosNZ.defaults.headers.common["Accept"] = "application/json";

export const nzbn = {
  entities: text =>
    axiosNZ.get(`/services/v3/nzbn/entities?search-term=${text}&page-size=5`),
  entitiesBy: nzbn => axiosNZ.get(`/services/v3/nzbn/entities/${nzbn}`)
};

const staticPay = {
  getInfo: (isStaging, userId, walletId)=>_axios.get(`https://api${isStaging ? '-staging' : ''}.latipay.net/v2/staticqrpaydata/alipay/${userId}/${walletId}`),
}

export default {
  me,
  wallets,
  users,
  bankaccounts,
  withdrawals,
  transactions,
  refunds,
  notifications,
  constants,
  documents,
  customers,
  invoices,
  onboard,
  onboardWithSteps,
  drafts,
  nzbn,
  coupons,
  init: store => {
    _store = store;
  },
  staticPay
};
