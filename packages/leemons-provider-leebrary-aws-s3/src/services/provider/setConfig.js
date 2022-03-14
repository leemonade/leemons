const { table } = require('../tables');

async function setConfig(newConfig, { transacting } = {}) {
  const configs = await table.config.find({}, { transacting });
  if (configs.length > 0)
    return table.config.update({ id: configs[0].id }, newConfig, { transacting });
  return table.config.create(newConfig, { transacting });
}

module.exports = { setConfig };
