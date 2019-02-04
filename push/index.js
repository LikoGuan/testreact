const express = require('express');
const apn = require('apn');
var bodyParser = require('body-parser');

// const checkSignature = require('./src/checkSignature');

const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const DEPLOY_ENV = process.env.DEPLOY_ENV;

const isProd = DEPLOY_ENV === 'prod';

const debugNote = () => {
  return {};
};

const apnProvider = new apn.Provider({
  token: {
    key: './AuthKey_8X6284HA88.p8',
    keyId: '8X6284HA88',
    teamId: 'WYFLVU5F9U'
  },
  production: isProd
});

app.post('/apns', (req, res) => {
  // console.log(req.headers);
  // console.log('-----');
  // console.log(req.body);

  const ip = req.headers['cf-connecting-ip'];
  if (isProd && ip !== '47.52.64.174') {
    //!checkSignature(req)
    console.log(
      `\n${new Date().toISOString()} invalid authorization or x-time ${req.get(
        'Authorization'
      )} ${req.get('X-Time')}`
    );
    res.status(401).end();
    return;
  }

  const {
    deviceTokens = debugNote().deviceTokens,
    badge = debugNote().badge,
    alert = debugNote().alert,
    payload = debugNote().payload,
    sound = debugNote().sound,
    topic = debugNote().topic
  } =
    req.body || {};

  const note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 600; // Expires 10 minutes from now.
  note.topic = topic || 'net.latipay.ios'; //net.latipay

  if (badge != undefined && badge != null) {
    note.badge = badge;
  }

  note.alert = alert;
  note.payload = payload;

  if (sound) {
    note.sound = sound;
  }

  const text = `${new Date().toISOString()} ${JSON.stringify({
    expiry: note.expiry,
    badge: note.aps.badge,
    alert: note.aps.alert,
    sound: note.aps.sound,
    payload: note.payload,
    topic: note.topic,
    deviceTokens: deviceTokens
  })}`;

  apnProvider.send(note, deviceTokens).then(result => {
    console.log(
      `\n${text}\n${new Date().toISOString()} ${JSON.stringify(result)}`
    );
    res.json(result);
  });
});

app.listen(3002, () => console.log('Listening on port 3002'));
