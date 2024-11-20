const { list: listProviders } = require('./list');

/**
 * This function retrieves a specific provider by its name from the list of all providers available in the plugin.
 *
 * @param {Object} params - The params object.
 * @param {string} params.type - The type of the provider to be retrieved.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryProvider[]>} - Returns the provider object if found, otherwise returns null.
 */
async function getByType({ type, ctx }) {
  const providers = (await listProviders({ ctx })) ?? [];

  return providers
    .filter((item) => item.params.type === type)
    .map((provider) => ({ pluginName: provider.pluginName, ...provider.params }));
}

module.exports = { getByType };
