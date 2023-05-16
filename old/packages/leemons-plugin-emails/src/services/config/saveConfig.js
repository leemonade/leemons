const _ = require('lodash');
const { getConfig } = require('./getConfig');

const table = {
  config: leemons.query('plugins_emails::config'),
};

async function saveConfig(userAgent, values, { transacting } = {}) {
  const promises = [];
  _.forIn(values, (value, key) => {
    promises.push(
      table.config.set(
        { userAgent, key },
        {
          userAgent,
          key,
          value: JSON.stringify(value),
        },
        { transacting }
      )
    );
  });
  await Promise.all(promises);
  return getConfig(userAgent, { transacting });
}

module.exports = { saveConfig };
