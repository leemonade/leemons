const { table } = require('../tables');

async function removeConfig({ transacting } = {}) {
  const configs = await table.config.find({}, { transacting });
  if (configs.length > 0) {
    await table.config.delete({ id: configs[0].id }, { transacting });
  }
  return null;
}

module.exports = { removeConfig };
