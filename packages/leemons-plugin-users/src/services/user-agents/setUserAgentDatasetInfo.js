const _ = require('lodash');
const { table } = require('../tables');

async function setUserAgentDatasetInfo(userAgentId, value, { transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;
  const userAgent = await table.userAgent.findOne({ id: userAgentId });
  const userSession = await table.users.findOne({ id: userAgent.user });
  userSession.userAgents = [userAgent];
  return datasetService.setValues('user-data', 'plugins.users', value, userSession.userAgents, {
    target: userSession.userAgents[0].id,
    transacting,
  });
}

module.exports = { setUserAgentDatasetInfo };
