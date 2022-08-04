const _ = require('lodash');

const table = {
  config: leemons.query('plugins_emails::config'),
};

async function getUserAgentsWithKeyValue(key, { transacting } = {}) {
  const configs = await table.config.find(
    { key, value_$neq: JSON.stringify(false) },
    { columns: ['userAgent', 'value'], transacting }
  );
  const result = {};
  _.forEach(configs, ({ userAgent, value }) => {
    result[userAgent] = JSON.parse(value);
  });
  return result;
}

module.exports = { getUserAgentsWithKeyValue };
