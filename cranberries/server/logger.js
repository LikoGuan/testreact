var winston = require('winston');
const nodemailer = require('nodemailer');

const { combine, timestamp, printf } = winston.format;

const myFormat = printf(info => {
  const { timestamp, level, message } = info;
  delete info.timestamp;
  delete info.level;
  delete info.message;

  const text = `${timestamp} ${level}: ${message} ${JSON.stringify(info)}\n`;

  return text;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), myFormat),
  transports: [
    new winston.transports.File({
      filename: '../pay-error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: '../pay-info.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      myFormat
    })
  );
}

module.exports = {
  info: (message, obj) => {
    logger.info(message, obj);
  },
  error: (message, obj = {}) => {
    logger.error(message, obj);

    const text = `${new Date()}: ${message}

${JSON.stringify(obj)}`;

    if (process.env.NODE_ENV === 'production') {
      sendEmail(text);
    }
  }
};

function sendEmail(text) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'latipay.notifier@gmail.com', // generated ethereal user
      pass: '1E26540B-F862-4D7F-B522-81FCF2A6DF91' // generated ethereal password
    }
  });

  const DEPLOY_ENV = process.env.DEPLOY_ENV;
  // setup email data with unicode symbols
  let mailOptions = {
    from: 'latipay.notifier@gmail.com', // sender address
    to: 'latipay.notifier@gmail.com', // list of receivers
    subject: `Log Error ${DEPLOY_ENV}`, // Subject line
    text
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    logger.info('Email sent', { messageId: info.messageId });
  });
}
