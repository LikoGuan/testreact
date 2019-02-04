const logger = require('../logger');

module.exports = nextapp => async (req, res, transaction) => {
  logger.info('gateways.generic', { transaction });

  nextapp.render(req, res, '/generic', {
    transaction
  });
};
