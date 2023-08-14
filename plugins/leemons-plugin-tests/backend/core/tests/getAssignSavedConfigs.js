/* eslint-disable no-param-reassign */

const _ = require('lodash');
const { table } = require('../tables');

async function getAssignSavedConfigs(userSession, { transacting } = {}) {
  const configs = await table.assignSavedConfig.find(
    {
      userAgent: userSession.userAgents[0].id,
    },
    { transacting }
  );
  return _.map(configs, (config) => ({
    ...config,
    config: JSON.parse(config.config),
  }));
}

module.exports = { getAssignSavedConfigs };
