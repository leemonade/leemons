const { table } = require('../tables');

async function getConfig({ transacting } = {}) {
  const configs = await table.config.find({}, { transacting });
  if (configs.length > 0) return configs[0];
  return null;
}

module.exports = { getConfig };
