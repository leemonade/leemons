const { activeProvider } = require('../tables');

async function getActiveProvider({ transacting } = {}) {
  const activeProviders = await activeProvider.find({}, { transacting });
  if (activeProviders.length) return activeProviders[0].providerName;
  return null;
}

module.exports = { getActiveProvider };
