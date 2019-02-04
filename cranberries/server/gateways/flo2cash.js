const api = require('../api');

module.exports = nextapp => async (req, res, transaction) => {
  const { apiKey } = await api.flo2CashAPIKey();
  nextapp.render(req, res, '/flo2cash', {
    transaction,
    apiKey
  });
};
