const logger = require('../logger');

module.exports = nextapp => async (req, res, transaction) => {
  logger.info('gateways.onlineBank', { transaction });

  nextapp.render(req, res, '/onlineBank', {
    transaction
  });
};
