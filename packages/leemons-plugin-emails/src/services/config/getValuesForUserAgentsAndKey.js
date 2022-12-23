const _ = require('lodash');
const { keysDefaults } = require('./getConfig');

const table = {
  config: leemons.query('plugins_emails::config'),
};

async function getValuesForUserAgentsAndKey(userAgents, key, { transacting } = {}) {
  const configs = await table.config.find(
    { key, userAgent_$in: userAgents },
    { columns: ['userAgent', 'value'], transacting }
  );
  const configByUserAgents = _.keyBy(configs, 'userAgent');
  const result = {};
  _.forEach(userAgents, (userAgent) => {
    if (configByUserAgents[userAgent]) {
      result[userAgent] = JSON.parse(configByUserAgents[userAgent].value);
    } else {
      result[userAgent] = keysDefaults[key];
    }
  });
  return result;
}

module.exports = { getValuesForUserAgentsAndKey };
