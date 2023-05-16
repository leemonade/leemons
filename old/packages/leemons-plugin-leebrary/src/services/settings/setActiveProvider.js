const { set: updateSettings } = require('./set');

async function setActiveProvider(providerName, { transacting } = {}) {
  const settings = await updateSettings({ providerName }, { transacting });
  return settings;
}

module.exports = { setActiveProvider };
