const json2xml = require('json2xml');
var parser = require('xml2json');
const axios = require('axios');

const config = require('../config');
const logger = require('./logger');

let counter = 0;
axios.interceptors.request.use(
  config => {
    config.reqId = counter++;
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  function(response) {
    // const { data, status, statusText, headers, config: { reqId } } = response;
    return response;
  },
  function(error) {
    logger.error('api error', { error: error.name + ' ' + error.message });
    return Promise.reject(error);
  }
);

module.exports = {
  profile: async payload => {
    //jwt validation
    const { jwt, userId } = payload;

    const resp = await axios({
      url: config.backend.base + '/org/account/profile',
      method: 'get',
      headers: {
        'X-USER-ID': userId,
        Authorization: jwt
      }
    });

    return resp.data;
  },
  transaction: async payload => {
    const resp = await axios.post(
      config.backend.base + '/v2/transaction',
      payload
    );
    return resp.data;
  },
  getTransByNounce: async (nonce, userAgent) => {
    console.log('config.backend.base', config.backend.base);
    const resp = await axios.get(
      config.backend.base + `/v2/gatewaydata/${nonce}`,
      {
        headers: userAgent ? { 'user-agent': userAgent } : {}
      }
    );
    return resp.data;
  },
  getInvoice: async invoiceId => {
    const resp = await axios.get(config.backend.base + `/invoice/${invoiceId}`);
    return resp.data;
  },
  getInvoiceToPay: async invoiceId => {
    const resp = await axios.get(
      config.backend.base + `/v2/invoice/inner/${invoiceId}`
    );
    return resp.data;
  },
  postWechat: async transaction => {
    const resp = await axios.post(
      transaction.gateway_url,
      json2xml({ xml: transaction.gatewaydata })
    );

    const data = parser.toJson(resp.data, { object: true });
    return data.xml;
  },
  postAlipay: async transaction => {
    const resp = await axios({
      url: transaction.gateway_url,
      method: 'post',
      data: transaction.gatewaydata,
      transformRequest: [
        function(data) {
          // Do whatever you want to transform the data
          let ret = '';
          for (let it in data) {
            ret +=
              encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
          }
          return ret;
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    logger.info('api alipay', { data: resp.data });
    const data = parser.toJson(resp.data, { object: true });
    return data.alipay;
  },
  getWalletInfo: async (walletId, userId) => {
    const resp = await axios.get(
      config.backend.base + `/v2/detail/${walletId}?user_id=${userId}`
    );
    console.log('config.backend.base', config.backend.base, resp.data);

    return resp.data;
  },
  shopifyAuth: async payload => {
    try {
      const { data } = await axios({
        url: `${config.shopifyBackend.base}/paytolati/auth`,
        method: 'post',
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { url, message = 'Unknow Error' } = data || {};
      if (url) {
        return { code: 0, url: url };
      }

      return { code: 1, message: message };
    } catch (e) {
      return { code: 1, message: 'Unknow Error' };
    }
  },
  flo2CashAPIKey: async () => {
    try {
      const { data } = await axios({
        url: `https://${config.flo2cashHost}/integration/apikeys/iframe`,
        method: 'post',
        headers: {
          Authorization:
            'Basic NTExMDMvYWRtaW46Y2RjYWMxNWMtMzAyNC00MzZjLWFlNjctYTExMTU0YjU0NDVh'
        }
      });

      const { value, Message = 'Unknow Error' } = data || {};
      if (value) {
        return { code: 0, apiKey: value };
      }

      return { code: 1, message: Message };
    } catch (e) {
      return { code: 1, message: 'Unknow Error' };
    }
  },
  flo2CashPayment: async body => {
    console.log('flo2CashPayment', body);
    try {
      const { data } = await axios({
        url: `https://${config.flo2cashHost}/api/payments`,
        method: 'post',
        data: body,
        headers: {
          Authorization:
            'Basic NTExMDMvYWRtaW46Y2RjYWMxNWMtMzAyNC00MzZjLWFlNjctYTExMTU0YjU0NDVh'
        }
      });

      console.log('--data', data);

      return { code: 0, data: data };
    } catch (e) {
      return { code: 1, data: e.response.data };
    }
  },

  datacomOneTimeToken: async () => {
    try {
      const { data } = await axios({
        url: `${config.shopifyBackend.base}/datacom/onetimetoken`,
        method: 'post'
      });

      const { opt, Message = 'Unknow Error' } = data || {};
      if (opt) {
        return { code: 0, opt };
      }

      return { code: 1, message: Message };
    } catch (e) {
      return { code: 1, message: 'Unknow Error' };
    }
  },
  queryOrder: async orderId => {
    const resp = await axios.post(config.backend.base + '/v2/queryOrder', {
      orderId
    });
    return resp.data;
  }
};
