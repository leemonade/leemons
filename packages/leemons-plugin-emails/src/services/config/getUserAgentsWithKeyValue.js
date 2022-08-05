const _ = require('lodash');

const table = {
  config: leemons.query('plugins_emails::config'),
};

async function getUserAgentsWithKeyValue(key, { value, transacting } = {}) {
  const query = {
    key,
  };
  if (value) {
    query.value = JSON.stringify(value);
  } else {
    query.value_$neq = JSON.stringify(false);
  }

  const configs = await table.config.find(query, { columns: ['userAgent', 'value'], transacting });

  if (value) {
    return _.map(configs, 'userAgent');
  }

  const result = {};
  _.forEach(configs, ({ userAgent, value: v }) => {
    result[userAgent] = JSON.parse(v);
  });
  return result;
}

module.exports = { getUserAgentsWithKeyValue };
