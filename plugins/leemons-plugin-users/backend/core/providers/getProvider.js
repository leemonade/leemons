const { getPluginProvider } = require('@leemons/providers');

/**
 *
 * @typedef {object} SupportedMethods
 * @property {object} users
 * @property {boolean} users.addUser
 *
 *
 *
 * @typedef {object} Provider
 * @property {string} pluginName
 * @property {string} image
 * @property {SupportedMethods} supportedMethods
 */

/**
 *
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 * @returns {Promise<Provider | null>}
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

  return { ...providerEntry.value.params, pluginName: providerEntry.value.pluginName };
}

module.exports = { getProvider };
