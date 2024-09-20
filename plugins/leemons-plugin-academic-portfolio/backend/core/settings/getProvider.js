const { getPluginProviders } = require('@leemons/providers');

async function getProvider({ pluginName, type, ctx }) {
  const providers =
    (await getPluginProviders({ keyValueModel: ctx.tx.db.KeyValue, raw: true })) ?? [];
  const provider = providers.find(
    (item) => item.pluginName === pluginName && item.params?.type === type
  );
  return provider
    ? {
        pluginName: provider.pluginName,
        name: provider.params?.name,
        type: provider.params?.type,
        ...provider.params,
      }
    : null;
}

module.exports = { getProvider };
