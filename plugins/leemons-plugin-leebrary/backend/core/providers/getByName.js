const { list: listProviders } = require('./list');

/**
 * This function retrieves a specific provider by its name from the list of all providers available in the plugin.
 *
 * @param {Object} params - The params object.
 * @param {string} params.name - The name of the provider to be retrieved.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryProvider|null>} - Returns the provider object if found, otherwise returns null.
 */
async function getByName({ name, ctx }) {
  const providers = (await listProviders({ ctx })) ?? [];
  const provider = providers.find((item) => item.pluginName === name);
  return provider ? { pluginName: provider.pluginName, ...provider.params } : null;
}

module.exports = { getByName };
