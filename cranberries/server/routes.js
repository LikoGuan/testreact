var QRCode = require('qrcode');
const api = require('./api');
const { testNonce } = require('./util');
const logger = require('./logger');

module.exports = (server, nextapp) => {
  const gateways = require('./gateways')(nextapp);

  server.get('/pay/:nonce', async (req, res) => {
    const nonce = req.params.nonce;

    //从后端 重定向
    if (nonce === 'wechat_in_app') {
      const query = req.query || {};
      logger.info('/pay/wechat_in_app >', query);

      nextapp.render(req, res, '/wechatInAppWithQuery', query);
      return;
    }

    if (!testNonce(nonce)) {
      logger.error('/pay/:nonce > invalid', { nonce });

      return res.status(400).send('nonce invalid');
    }

    const userAgent = req.headers['user-agent'] || '';

    logger.info('/pay/:nonce', { nonce, userAgent });
    const transaction = await api.getTransByNounce(nonce, userAgent);
    logger.info('/pay/:nonce', { nonce, transaction });

    const gatewaydata = transaction.gatewaydata || {};
    if (gatewaydata.rmb_fee === null) {
      logger.info('/pay/:nonce gatewaydata.rmb_fee == null');

      delete gatewaydata.rmb_fee;
      transaction.gatewaydata = gatewaydata;
    }
    if (gatewaydata.total_fee === null) {
      logger.info('/pay/:nonce gatewaydata.total_fee == null');

      delete gatewaydata.total_fee;
      transaction.gatewaydata = gatewaydata;
    }

    if (
      transaction.code === 0 &&
      transaction.paydata &&
      transaction.gatewaydata
    ) {
      const { paydata } = transaction;
      if (
        (userAgent.toLowerCase().indexOf('micromessenger') !== -1 &&
          paydata.paymentMethod === 'alipay') ||
        (userAgent.toLowerCase().indexOf('alipay') !== -1 &&
          paydata.paymentMethod === 'wechat')
      ) {
        logger.info('/pay/:nonce > show tips for open in other app or browser');

        //提示 微信/支付宝中打开
        nextapp.render(req, res, '/openInBrowser', {
          paymentMethod: paydata.paymentMethod
        });
        return;
      }

      const { qrcode } = req.query;
      if (qrcode === '1' || qrcode === 1) {
        logger.info('/pay/:nonce > show QR code picture');

        QRCode.toFileStream(res, `https://${req.headers.host}/pay/${nonce}`);
        return;
      }

      gateways(req, res, transaction);
    } else {
      const { code } = transaction;

      const isWechat = userAgent.toLowerCase().indexOf('micromessenger') !== -1;

      if (code === 202) {
        nextapp.render(req, res, '/paid');
      } else if (code === 217 && isWechat) {
        logger.error('/pay/:nonce > transaction.code !== 0', {
          nonce,
          userAgent,
          transaction
        });

        //openid失效的话，重新再走一步code -> openId，重定向301
        res.redirect(
          302,
          'https://api.latipay.co.nz/v2/gatewaydata_inapp/' + nonce
        );
      } else if (code === 201) {
        logger.error('/pay/:nonce > transaction.code !== 0', {
          nonce,
          userAgent,
          transaction
        });

        res
          .status(404)
          .send('Error Code: ' + transaction.code + ', ' + transaction.message);
      } else {
        logger.error(
          '/pay/:nonce > transaction.code !== 0 or no gatewaydata or no gatewaydata',
          {
            nonce,
            userAgent,
            transaction
          }
        );

        res
          .status(400)
          .send('Error Code: ' + transaction.code + ', ' + transaction.message);
      }
    }
  });

  server.get('/invoice/:invoiceID', async (req, res) => {
    const { invoiceID } = req.params;

    logger.info('/invoice/:invoiceID', { invoiceID });
    const invoice = await api.getInvoiceToPay(invoiceID);

    logger.info('/invoice/:invoiceID', { invoice });

    if (invoice.code === 0) {
      let { status } = invoice;

      if (
        status === 'paid' ||
        status === 'success' ||
        status === 'manual_paid'
      ) {
        nextapp.render(req, res, '/paid');
      } else {
        if (!invoice.margins) {
          const oldInvoice = await api.getInvoice(invoiceID);
          logger.info('/invoice/:invoiceID > oldInvoice', { oldInvoice });

          if (oldInvoice.code === 0) {
            invoice.margins = oldInvoice.margins;
          }
        }

        logger.info('/invoice/:invoiceID > render', { invoice });
        nextapp.render(req, res, '/invoice', {
          invoice
        });
      }
    } else if (invoice.code === 100) {
      logger.error('/invoice/:invoiceID > code is 100', {
        invoiceID,
        invoice
      });
      //TODO
      const message = 'Page expired.';
      res.redirect(301, `/?message=${message}`);
    } else {
      logger.error('/invoice/:invoiceID', { invoiceID, invoice });

      res
        .status(400)
        .send('Error Code: ' + invoice.code + ', ' + invoice.message);
    }
  });

  server.get('/shopifyMethod', async (req, res) => {
    logger.info('/shopifyMethod > get');

    nextapp.render(req, res, '/', {
      message: 'Thank you for choosing Latipay.'
    });
  });

  server.post('/shopifyMethod', async (req, res) => {
    const body = req.body;
    const { wallet_id, user_id } = body; //x-www-form-urlencoded

    //TODO has payed or not?
    try {
      logger.info('/shopifyMethod', { wallet_id, user_id });

      const data = await api.getWalletInfo(wallet_id, user_id);

      logger.info('/shopifyMethod > data', { data });
      if (data.code === 0) {
        const { payment_method, currency } = data;

        let method = payment_method.split(',') || [];
        method = method.filter(item => item);
        method = method.map(item => item.toLowerCase());

        //sort as this order
        let order = ['onlinebank', 'wechat', 'alipay'];
        method = method.sort((a, b) => {
          return order.indexOf(a) > order.indexOf(b) ? -1 : 1;
        });

        body.paymentMethods = method;

        body.currency = currency;

        logger.info('/shopifyMethod > body', { body });
        nextapp.render(req, res, '/shopify', body);
      } else {
        logger.error('/shopifyMethod > data', { body, data });

        res.status(400).send('Error Code: ' + data.code + ', ' + data.message);
      }
    } catch (err) {
      logger.error('/shopifyMethod > exception Cannot get wallet info', {
        body
      });

      res.status(400).send('Cannot get wallet info');
    }
  });

  server.post('/shopifyAuth', async (req, res) => {
    const payload = req.body;
    const resp = await api.shopifyAuth(payload);

    logger.info('/shopifyAuth', { resp });
    res.status(200).send(resp);
  });

  // server.get('/methods', async (req, res) => {
  //   nextapp.render(req, res, '/methods', {
  //     paymentMethods: ['onlinebank', 'wechat', 'alipay', 'flo2cash']
  //   });
  // });

  server.post('/flo2cash/payment', async (req, res) => {
    const body = req.body;
    const token = body['f2c-token'];
    if (!token) {
      res.status(400).send('Need f2c-token');
      return;
    }

    const { nonce } = body;
    if (!nonce) {
      res.status(400).send('Need nonce');
      return;
    }

    const transaction = await api.getTransByNounce(nonce);
    if (transaction.code !== 0) {
      res.status(404).send('Order not exist');
      return;
    }

    const {
      amount,
      orderId,
      paymentMethod,
      customerOrderId
    } = transaction.paydata;

    if (paymentMethod !== 'flo2cash') {
      res.status(404).send('Order not exist');
      return;
    }

    // 4. "reference1": "my ref 1",
    // 5. "reference2": "my ref 2",
    // 8. "initiatedBy": "first.last",
    // 9. "receiptRecipient":"you@example.org",
    // "device": {
    // "id": "NOKIA1100",
    // "description": "this is device description" },
    // "geolocation": { "latitude": "52.3655", "longitude": "96.3652"

    const { data } = await api.flo2CashPayment({
      channel: 'web',
      reference1: orderId,
      amount,
      currency: 'NZD',
      type: 'purchase',
      merchant: {
        subAccount: 11136 //TODO
      },
      paymentMethod: {
        type: 'iframe',
        iframe: {
          value: token
        }
      }
    });

    //   { transaction: null,
    // number: 'P1802M0000073726',
    // timestamp: '2018-02-05T12:10:29',
    // type: 'purchase',
    // status: 'declined',
    // channel: 'web',
    // reference: null,
    // particulars: null,
    // amount: 1.05,
    // amountCaptured: 0,
    // amountRefunded: 0,
    // currency: 'NZD',
    // initiatedBy: null,
    // receiptRecipient: null,
    // response:
    //  { code: 202,
    //    message: 'declined - bank declined',
    //    providerResponse: '05',
    //    authCode: '6D52BB' },
    // merchant: { id: , subAccount:  },
    // paymentMethod:
    //  { type: 1,
    //    dtpToken: null,
    //    dtpPreAuthToken: null,
    //    mapToken: null,
    //    card:
    //     { number: null,
    //       expiryDate: '1118',
    //       cvv: null,
    //       nameOnCard: '11',
    //       createMapToken: false,
    //       DtpToken: null,
    //       mapToken: null,
    //       cardScheme: 'mastercard',
    //       cardBin: '512345',
    //       cardLastFour: '2346',
    //       mask: '512345******2346' } },
    // device: null,
    // geolocation: null,
    // refunds: null,
    // captures: null }

    const { response = {} } = data;

    const {
      returnUrl,
      currency,
      createDate
      // accountId,
      // userId
    } = transaction.paydata;

    const status = response.code === 0 ? 'paid' : 'fail';

    const result = {
      currency,
      merchant_reference: customerOrderId,
      payment_method: paymentMethod,
      status
    };

    //为了获得订单amount(减去手续费的amount)
    const order = await api.queryOrder(orderId);
    result.amount = order.amount;

    if (returnUrl && returnUrl.length > 0) {
      result.createDate = createDate;
      // const resp = api.(accountId, userId);
      // console.log('resp', resp);
      //
      // if (resp.code === 0 && resp.api_key) {
      //   result.signature = signature(result, resp.api_key, [
      //     'merchant_reference',
      //     'payment_method',
      //     'status',
      //     'currency',
      //     'amount'
      //   ]);
      // }

      const query = Object.keys(result).map(key => `${key}=${result[key]}`);
      res.redirect(301, `${returnUrl}?${query.join('&')}`);
    } else {
      const query = Object.keys(result).map(key => `${key}=${result[key]}`);
      res.redirect(301, `/confirmation?${query.join('&')}`);
    }
  });

  server.get('/confirmation', async (req, res) => {
    nextapp.render(req, res, '/confirmation', req.query);
  });

  server.post('/datacom/payment', async (req, res) => {
    const body = req.body;
    const token = body['f2c-token'];
    if (!token) {
      res.status(400).send('Need f2c-token');
      return;
    }

    const { nonce } = body;
    if (!nonce) {
      res.status(400).send('Need nonce');
      return;
    }

    const transaction = await api.getTransByNounce(nonce);
    if (transaction.code !== 0) {
      res.status(404).send('Order not exist');
      return;
    }

    const {
      amount,
      orderId,
      paymentMethod,
      customerOrderId
    } = transaction.paydata;
    if (paymentMethod !== 'flo2cash') {
      res.status(404).send('Order not exist');
      return;
    }

    // 4. "reference1": "my ref 1",
    // 5. "reference2": "my ref 2",
    // 8. "initiatedBy": "first.last",
    // 9. "receiptRecipient":"you@example.org",
    // "device": {
    // "id": "NOKIA1100",
    // "description": "this is device description" },
    // "geolocation": { "latitude": "52.3655", "longitude": "96.3652"

    const { data } = await api.flo2CashPayment({
      channel: 'web',
      reference1: orderId,
      amount,
      currency: 'NZD',
      type: 'purchase',
      merchant: {
        subAccount: 11136 //TODO
      },
      paymentMethod: {
        type: 'iframe',
        iframe: {
          value: token
        }
      }
    });

    //   { transaction: null,
    // number: 'P1802M0000073726',
    // timestamp: '2018-02-05T12:10:29',
    // type: 'purchase',
    // status: 'declined',
    // channel: 'web',
    // reference: null,
    // particulars: null,
    // amount: 1.05,
    // amountCaptured: 0,
    // amountRefunded: 0,
    // currency: 'NZD',
    // initiatedBy: null,
    // receiptRecipient: null,
    // response:
    //  { code: 202,
    //    message: 'declined - bank declined',
    //    providerResponse: '05',
    //    authCode: '6D52BB' },
    // merchant: { id: , subAccount:  },
    // paymentMethod:
    //  { type: 1,
    //    dtpToken: null,
    //    dtpPreAuthToken: null,
    //    mapToken: null,
    //    card:
    //     { number: null,
    //       expiryDate: '1118',
    //       cvv: null,
    //       nameOnCard: '11',
    //       createMapToken: false,
    //       DtpToken: null,
    //       mapToken: null,
    //       cardScheme: 'mastercard',
    //       cardBin: '512345',
    //       cardLastFour: '2346',
    //       mask: '512345******2346' } },
    // device: null,
    // geolocation: null,
    // refunds: null,
    // captures: null }

    const { response = {} } = data;

    const {
      returnUrl,
      currency,
      createDate
      // accountId,
      // userId
    } = transaction.paydata;

    const status = response.code === 0 ? 'paid' : 'fail';

    const result = {
      currency,
      merchant_reference: customerOrderId,
      payment_method: paymentMethod,
      createDate,
      status
    };

    //为了获得订单amount(减去手续费的amount)
    const order = await api.queryOrder(orderId);
    result.amount = order.amount;

    if (returnUrl && returnUrl.length > 0) {
      // const resp = api.(accountId, userId);
      // console.log('resp', resp);
      //
      // if (resp.code === 0 && resp.api_key) {
      //   result.signature = signature(result, resp.api_key, [
      //     'merchant_reference',
      //     'payment_method',
      //     'status',
      //     'currency',
      //     'amount'
      //   ]);
      // }

      const query = Object.keys(result).map(key => `${key}=${result[key]}`);
      res.redirect(301, `${returnUrl}?${query.join('&')}`);
    } else {
      const query = Object.keys(result).map(key => `${key}=${result[key]}`);
      res.redirect(301, `/confirmation?${query.join('&')}`);
    }
  });

  server.post('/log', async (req, res) => {
    const referer = req.headers['referer'];
    if (
      referer.indexOf('https://pay-staging.latipay.net') === -1 &&
      referer.indexOf('https://pay.latipay.net') === -1
    ) {
      res.status(200).send('done.');
      return;
    }

    const body = req.body || {};

    const { message } = body;
    delete body.message;

    logger.info(`Front > ${message}`, body);

    res.status(200).send('done');
  });

  // server.get('/testwechat', async (req, res) => {
  //   nextapp.render(req, res, '/wechatInApp', {});
  // });

  /*---------test below--------*/

  // server.get('/shopifyMethod1', async (req, res) => {
  // const body = { wallet_id: 'W199626166',
  //   amount: '0.01',
  //   user_id: 'U184997582',
  //   merchant_reference: '20171030-U184997582-0000013114',
  //   callback_url: 'callback_url',
  //   return_url: 'https://7f9a4826.ngrok.io/paytolati/receiver',
  //   ip: '127.0.0.1',
  //   version: '2.0',
  //   product_name: 'shopify prod',
  //   present_qr: '1',
  // };
  // body.currency = 'CNY';

  //   const { wallet_id, user_id } = body; //x-www-form-urlencoded

  //   // nextapp.render(req, res, '/shopify', body);
  //   // return;

  //   //TODO has payed or not?
  //   try {
  //     const data = await api.getWalletInfo(wallet_id, user_id);
  //     if (data.code === 0) {
  //       const {payment_method, currency} = data;

  //       let method = payment_method.split(',') || [];
  //       method = method.filter(item=>item);
  //       method = method.map(item=>item.toLowerCase());

  //       //sort as this order
  //       let order = ['onlinebank', 'wechat', 'alipay'];
  //       method = method.sort((a, b)=>{
  //         return order.indexOf(a) > order.indexOf(b) ? -1 : 1;
  //       });

  //       body.paymentMethods = method;

  //       console.log('body.paymentMethods', body.paymentMethods);
  //       body.currency = currency;

  //       nextapp.render(req, res, '/shopify', body);
  //     } else {
  //       res.status(400);
  //       res.send('Error Code: ' + data.code + ', ' + data.message);
  //     }
  //   } catch(err) {
  //     res.status(400);
  //     res.send('Cannot get wallert info');
  //   }
  // });

  // server.get('/callback', async (req, res) => {
  //   console.log('callback -- req', req.query);

  //   res.status(200);
  //   res.send("hello");
  // });
};
