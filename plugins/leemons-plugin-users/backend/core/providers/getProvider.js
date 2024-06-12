const { getPluginProvider } = require('@leemons/providers');

/**
 *
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function getProvider({ ctx }) {
  const provider = await ctx.tx.db.LoginProvider.findOne({});

  if (!provider) {
    return null;
  }

  const providerEntry = await getPluginProvider({
    providerName: provider.name,
    keyValueModel: ctx.tx.db.KeyValue,
  });

  if (!providerEntry) {
    return null;
  }

  return providerEntry.value;
}

module.exports = { getProvider };
