const update = require('./update');

async function setActiveProvider({ pluginName, type, ctx }) {
  const settings = await update({ settings: {}, ctx });

  // Remove the provider from the settings, based on the type
  const activeProviders = (settings.activeProviders ?? []).filter(
    (provider) => provider.type !== type
  );

  if (pluginName) {
    // Add the new provider to the settings
    activeProviders.push({ pluginName, type });
  }

  return update({ settings: { activeProviders }, ctx });
}

module.exports = { setActiveProvider };
