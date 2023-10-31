const _ = require('lodash');
const { keysDefaults } = require('./getConfig');

async function getValuesForUserAgentsAndKey({ key, userAgents, ctx } = {}) {
  const configs = await ctx.tx.db.Config.find({ key, userAgent: userAgents }, [
    'userAgent',
    'value',
  ]);
  const configByUserAgents = _.keyBy(configs, 'userAgent');
  const result = {};
  _.forEach(userAgents, (userAgent) => {
    if (configByUserAgents[userAgent]) {
      result[userAgent] = JSON.parse(configByUserAgents[userAgent].value || null);
    } else {
      result[userAgent] = keysDefaults[key];
    }
  });
  return result;
}

module.exports = { getValuesForUserAgentsAndKey };
