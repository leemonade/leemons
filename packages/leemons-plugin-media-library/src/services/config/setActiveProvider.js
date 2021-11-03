const { table } = require('../tables');
const { getActiveProvider } = require('./getActiveProvider');

async function setActiveProvider(providerName, { transacting } = {}) {
  const activeProvider = await getActiveProvider({ transacting });
  if (activeProvider) {
    return table.activeProvider.update(
      { providerName: activeProvider },
      { providerName },
      { transacting }
    );
  }
  return table.activeProvider.create({ providerName }, { transacting });
}

module.exports = { setActiveProvider };
