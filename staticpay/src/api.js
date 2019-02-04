import axios from 'axios';
import { makeForm } from './utils';

const env = process.env.REACT_APP_DEPLOY_ENV || 'staging';

const BACKENDS = {
  dev: '-dev',
  staging: '-staging',
  prod: ''
};

const baseURL = `https://api${BACKENDS[env]}.latipay.net`;

const _axios = axios.create({
  baseURL
});

export const transaction = {
  init: (payData, form) => {
    // if (env === "staging") {
    // payData.openId = "ojxqK0rQirHe1lJKdkIYKONe7vgg";
    // }

    // 微信授权域名为api.altipay.co.nz，所以此处必须是a pi.latipay.co.nz，否则无法获取code
    // staging测试需要修改hosts，跳到staging的IP
    const hostMap = {
      wechat: 'https://api.latipay.co.nz',
      alipay: baseURL
    };

    const host = hostMap[payData.payment_method];
    const path = '/v3/staticpay?';

    //待优化：支付宝可以axios post，能获得API结果，方便提示用户
    //微信暂时只能使用makeform，应该co.nz重定向到微信
    makeForm(form, `${host}${path}`, payData);

    //支付宝 重定向到 qrcode_url
    //微信 重定向到 pay.latipay.net/pay/wechat_in_app
  },
  query: orderId => _axios.post('/v2/queryOrder', { orderId })
};

export const staticQR = {
  get: (paymentMethod, userId, walletId) =>
    _axios.get(`/v2/staticqrpaydata/${paymentMethod}/${userId}/${walletId}`)
};

export default {
  transaction,
  staticQR
};
