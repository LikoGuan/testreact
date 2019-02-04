const logger = require('../logger');
const api = require('../api');
const isMobile = require('../util').isMobile;

module.exports = nextapp => (req, res, transaction) => {
  const wechat = require('./wechat')(nextapp);
  const alipay = require('./alipay')(nextapp);
  const onlineBank = require('./onlineBank')(nextapp);
  const generic = require('./generic')(nextapp);
  const flo2cash = require('./flo2cash')(nextapp);
  const datacom = require('./datacom')(nextapp);

  const { paymentMethod, type } = transaction.paydata;

  logger.info('gateways', { transaction });

  switch (paymentMethod) {
  case 'wechat':
    return wechat(req, res, transaction);
  case 'payease':
    return onlineBank(req, res, transaction);
  case 'alipay': {
    if (transaction.gateway_url) {
      transaction.gateway_url =
          transaction.gateway_url + '?_input_charset=UTF-8';
    }

    const agent = req.headers['user-agent'].toLowerCase();
    const deeplink = /alipay/.test(agent) || isMobile(agent);

    const qr = transaction.paydata.presentQr;
    const spotpayDeeplink =
        type === 'SpotPay' && deeplink && (qr === 1 || qr === '1');

    if (
      (type === 'SpotPay' && !spotpayDeeplink) ||
        (type === 'Invoice' && !deeplink)
    ) {
      logger.info('gateways > alipay no deeplink', {
        type,
        spotpayDeeplink,
        deeplink
      });

      return alipay(req, res, transaction, deeplink);
    }

    if (
      type === 'StaticPay' ||
        spotpayDeeplink ||
        (type === 'Invoice' && deeplink)
    ) {
      logger.info('gateways > alipay deeplink', {
        type,
        spotpayDeeplink,
        deeplink
      });

      //静态二维码，支付宝app浏览器打开，自动支付
      //Invoice use alipay offline
      api
        .postAlipay(transaction)
        .then(({ response }) => {
          const qr_code = response.alipay.qr_code;

          logger.info('gateways > alipay redirect', {
            qr_code
          });

          res.redirect(qr_code);
        })
        .catch(function() {
          res.send('alipay payment failed');
        });
      return;
    }

    logger.info('gateways > alipay generic');
    return generic(req, res, transaction);
  }
  case 'flo2cash':
    return flo2cash(req, res, transaction);
  case 'datacom':
    return datacom(req, res, transaction);
  case 'unionpay':
    return generic(req, res, transaction);
  case 'polipay': {
    const { gateway_url } = transaction;
    res.redirect(301, gateway_url);
    break;
  }
  default:
    return res.send('not support current payment method');
  }
};
