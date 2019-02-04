const api = require('../api');
const logger = require('../logger');

module.exports = nextapp => async (req, res, transaction) => {
  const alipayData = await api.postAlipay(transaction);

  logger.info('gateways.alipay', { alipayData });

  //const { return_code, result_code, code_url, return_msg, trade_type } = alipayData;
  const { is_success, response } = alipayData;

  if (is_success === 'T' && response.alipay.result_code === 'SUCCESS') {
    const { qr_code } = response.alipay;
    // big_pic_url, out_trade_no, pic_url, qr_code, result_code, small_pic_url, voucher_type

    const qr = transaction.paydata.presentQr;
    if (qr === '1' || qr === 1) {
      logger.info('gateways.alipay > qr', { qr });

      nextapp.render(req, res, '/alipay', {
        qr: qr_code,
        transaction
      });
    } else {
      logger.info('gateways.alipay > json', { qr_code });

      res.json({ qr_code, code: 0 });
    }
  } else if (is_success === 'F') {
    logger.error('gateways.alipay > is_success', {
      transaction,
      alipayData
    });

    res.status(400);
    res.send(`alipay returned error: ${alipayData.error}`);
  } else {
    logger.error('gateways.alipay > return error', {
      transaction,
      alipayData
    });

    res.status(400);
    res.send(`alipay returned error: ${response.alipay.detail_error_code}`);
  }
};
