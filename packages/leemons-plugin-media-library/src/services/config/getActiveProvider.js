const { table } = require('../tables');

async function getActiveProvider({ transacting } = {}) {
  const activeProviders = await table.activeProvider.find({}, { transacting });
  if (activeProviders.length) return activeProviders[0].providerName;
  return null;
}

module.exports = { getActiveProvider };
