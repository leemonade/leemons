const findOne = require('./findOne');
const { getProvider } = require('./getProvider');

async function getActiveProvider({ type, ctx }) {
  const settings = await findOne({ ctx });

  const activeProvider = (settings?.activeProviders ?? []).find(
    (provider) => provider.type === type
  );

  if (!activeProvider) {
    return null;
  }

  const { pluginName } = activeProvider;

  return await getProvider({ pluginName, type, ctx });
}

module.exports = { getActiveProvider };
