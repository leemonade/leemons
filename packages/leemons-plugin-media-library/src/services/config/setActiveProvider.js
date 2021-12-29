const { activeProvider: activeProviderTable } = require('../tables');
const { getActiveProvider } = require('./getActiveProvider');

async function setActiveProvider(providerName, { transacting } = {}) {
  const activeProvider = await getActiveProvider({ transacting });
  if (activeProvider) {
    return activeProviderTable.update(
      { providerName: activeProvider },
      { providerName },
      { transacting }
    );
  }
  return activeProviderTable.create({ providerName }, { transacting });
}

module.exports = { setActiveProvider };
