const crypto = require('crypto');

const secret = 'FCDD84C8-4742-4678-A4F2-B081BCD9D986';

const checkSignature = function(req) {
  const authorization = req.get('Authorization');
  const time = req.get('X-Time');

  if (!authorization || !time) return false;

  const { deviceTokens, badge, alert, payload = {} } = req.body || {};
  if (!badge && !alert) return false;

  const obj = {
    alert,
    badge,
    deviceTokens: JSON.stringify([].concat(deviceTokens).sort()),
    payload: JSON.stringify(payload, Object.keys(payload).sort()),
    time
  };

  if (obj.deviceTokens.length === 0) return false;

  // const obj = {
  //   deviceTokens: JSON.stringify(
  //     [].concat([
  //       "465b2d70f8a508757649c6f558037494121e02bb4804760c0564081f58976331"
  //     ])
  //   ),
  //   alert: "Hello",
  //   badge: 0,
  //   payload: JSON.stringify(
  //     { from: "Sunm" },
  //     Object.keys({ from: "Sunm" }).sort()
  //   ),
  //   time: 1234567890
  // };
  const message = ['alert', 'badge', 'deviceTokens', 'payload', 'time']
    .sort()
    .filter(item => obj[item] != undefined && obj[item] !== null)
    .map(item => `${item}=${obj[item]}`)
    .join('&');

  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return authorization === computedSignature;
};

module.exports = checkSignature;
