const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

module.exports = nextapp => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.options('*', cors()); // include before other routes
  // server routes
  routes(app, nextapp);

  // statis file
  app.use('/blackberries', express.static('node_modules/blackberries/build'));
  app.use('/version', express.static('version.txt'));

  // next.js takes over
  const handle = nextapp.getRequestHandler();
  app.get('*', (req, res) => handle(req, res));

  // Optional fallthrough error handler
  app.use((err, req, res) => {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });

  return app;
};
