import axios from 'axios';
import config from '../config';
import interceptors from './interceptors';

// Instantiate axios
const _axios = axios.create({
  baseURL: config.backend.base,
});

// Add a request interceptor

interceptors.forEach(({ request = [], response = [] }) => {
  _axios.interceptors.request.use(...request);
  _axios.interceptors.response.use(...response);
});
// APIs
export const me = {
  login: credential => _axios.post('/trader/user/login', credential),
};

export const traderConstants = {
  list: () => _axios.get('/trader/constants'),
};

export const organisations = {
  list: params => _axios.get('/trader/organisations', { params }),
  id: id => _axios.get(`/trader/organisations/${id}`),
  update: (id, form) => _axios.put(`/trader/organisations/${id}`, form),
  patch: (id, form) => _axios.patch(`/trader/organisations/${id}`, form),
};

export const assessments = {
  id: id => _axios.get(`/trader/organisation_assessments/${id}`),
  create: form => _axios.post('/trader/organisation_assessments', form),
  update: (id, form) => _axios.put(`/trader/organisation_assessments/${id}`, form),
};

export const documents = {
  prepare: () => _axios.get('/trader/doc/getkey'),
  id: orgId => _axios.get(`trader/doc/${orgId}`),
  update: (orgId, form) => _axios.put(`trader/doc/${orgId}`, form),
  upload: (oss, file, filepath) => {
    oss.form.key = filepath;
    var data = new FormData();
    Object.keys(oss.form).forEach(key => {
      data.append(key, oss.form[key]);
    });
    data.append('file', file, file.name);
    return axios.post(oss.host, data);
  },
};

export const transactions = {
  list: params => _axios.get('/trader/transactions', { params }),
  updateAttachment: data => _axios.post('/trader/invoice/attachments', data),
};

export const invoice = {
  approve: id => _axios.post(`/trader/invoice/approve/${id}`),
};

export const pricing_plan = {
  id: id => _axios.get(`/trader/pricing_plan/${id}`),
  update: (id, data) => _axios.put(`/trader/pricing_plan/${id}`, data),
  create: data => _axios.post('/trader/pricing_plan', data),
};

export const fx_rate = {
  list: queryParams => _axios.get('/trader/fx_rate', { params: queryParams }),
};

export const task = {
  list: params => _axios.get('/trader/task', { params }),
  id: id => _axios.get(`/trader/task/${id}`),
  update: (id, data) => _axios.put(`/trader/task/${id}`, data),
  create: data => _axios.post('/trader/task', data),
};

export const task_history = {
  list: params => _axios.get('/trader/task_history', { params }),
};

export const admin = {
  list: params => _axios.get('/trader/user/list', { params }),
};

export const logs = {
  list: params => _axios.get('/trader/api_logs', { params }),
};

export const wallets = {
  list: params => _axios.get('/trader/wallets', { params }),
  patch: (id, form) => _axios.patch(`/trader/wallets/${id}`, form),
};

export const settlement = {
  list: params => _axios.get('/trader/finance/settle_orders', { params }),
  settle: form => _axios.post('/trader/finance/settle_orders/settle', form),
  approve: form => _axios.post('/trader/finance/settle_orders/approve', form),
  reject: form => _axios.post('/trader/finance/settle_orders/reject', form),
  bankfile: params => _axios.get('/trader/finance/settle_records', { params }),
};
export const systemBank = {
  list: params => _axios.get('/trader/finance/systemBanks', { params }),
  update: (id, form) => _axios.put(`/trader/finance/systemBanks/${id}`, form),
  create: form => _axios.post('/trader/finance/systemBanks', form),
  enable: id => _axios.put(`/trader/finance/systemBanks/status/${id}`, { status: 1 }),
  disable: id => _axios.put(`/trader/finance/systemBanks/status/${id}`, { status: 0 }),
  setprimary: id => _axios.put(`/trader/finance/systemBanks/primary/${id}`),
};

export const refunds = {
  id: id => _axios.get(`/trader/refunds/${id}`),
  create: data => _axios.post('/trader/refunds', data),
};

export default {
  traderConstants,
  me,
  organisations,
  assessments,
  transactions,
  pricing_plan,
  fx_rate,
  task,
  task_history,
  documents,
  admin,
  logs,
  wallets,
  settlement,
  systemBank,
  refunds,
  invoice,
};
