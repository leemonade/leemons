const _ = require('lodash');
const { getConfig } = require('./getConfig');

async function saveConfig({ ctx, userAgent, ...values } = {}) {
  const promises = [];
  _.forIn(values, (value, key) => {
    promises.push(
      ctx.tx.db.Config.updateOne(
        { userAgent, key },
        {
          userAgent,
          key,
          value: JSON.stringify(value),
        }
      )
    );
  });
  await Promise.all(promises);
  return getConfig({ ctx });
}

module.exports = { saveConfig };
