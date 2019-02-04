const CryptoJS = require('crypto-js');
const api = require('../api');
const { s8 } = require('../util');
const logger = require('../logger');

const sign = (payload, key) => {
  const sorted = Object.keys(payload)
    .sort()
    .map(key => `${key}=${payload[key]}`);
  sorted.push(`key=${key}`);
  const msg = sorted.join('&');
  return CryptoJS.MD5(msg)
    .toString()
    .toUpperCase();
};

const prepareWechatInAppData = (wechatdata, key) => {
  const { appid, prepay_id } = wechatdata;

  const payload = {
    appId: appid,
    timeStamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: s8() + s8() + s8() + s8(),
    package: `prepay_id=${prepay_id}`,
    signType: 'MD5'
  };

  payload.paySign = sign(payload, key);
  return payload;
};

module.exports = nextapp => async (req, res, transaction) => {
  const wechatdata = await api.postWechat(transaction);

  logger.info('gateways.wechat > wechatdata', { wechatdata });

  const {
    return_code,
    result_code,
    code_url,
    err_code_des,
    trade_type,
    return_msg
    // err_code
  } = wechatdata;

  if (return_code === 'SUCCESS' && result_code === 'SUCCESS') {
    if (trade_type === 'JSAPI') {
      //https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_2
      const {
        paydata: { wechatKey }
      } = transaction;

      const data = {
        transaction,
        wechatdata: prepareWechatInAppData(wechatdata, wechatKey)
      };

      logger.info('gateways.wechat > trade_type==JSAPI', { data });

      nextapp.render(req, res, '/wechatInApp', data);
    } else {
      const qr = transaction.paydata.presentQr;
      if (qr === '1' || qr === 1) {
        logger.info('gateways.wechat > qr', { qr, code_url });

        // merchant delegate latipay to display QR code
        nextapp.render(req, res, '/wechat', {
          qr: code_url,
          transaction
        });
      } else {
        logger.info('gateways.wechat > json', { code_url });

        // merchant choose to display QR code
        res.json({ code_url, code: 0 });
      }
    }
  } else {
    // if (err_code === 'ORDERPAID') {} TODO

    logger.error('gateways.wechat > error', {
      transaction,
      wechatdata
    });

    res.status(400);
    res.send(`wechat returned error: ${err_code_des} ${return_msg}`);
  }
};
