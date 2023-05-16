const _ = require('lodash');
const { table } = require('../tables');

async function setUserDatasetInfo(userId, value, { userSession, transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;
  return datasetService.setValues('user-data', 'plugins.users', value, userSession.userAgents, {
    target: userId,
    transacting,
  });
}

module.exports = { setUserDatasetInfo };
