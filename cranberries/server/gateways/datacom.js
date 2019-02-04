const api = require('../api');

module.exports = nextapp => async (req, res, transaction) => {
  const { oneTimeToken } = await api.datacomOneTimeToken();
  nextapp.render(req, res, '/datacom', {
    transaction,
    oneTimeToken
  });
};
