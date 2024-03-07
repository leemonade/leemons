const { list: listProviders } = require('./list');
const { normalizeItemsArray } = require('../shared/normalizeItemsArray');

/**
 * This function retrieves a specific provider by its name from the list of all providers available in the plugin.
 *
 * @param {Object} params - The params object.
 * @param {string[]} params.names - The names of the providers to be retrieved.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryProvider[]>} - Returns the provider object if found, otherwise returns null.
 */
async function getByNames({ names, ctx }) {
  const providers = (await listProviders({ ctx })) ?? [];
  return providers
    .filter((provider) => normalizeItemsArray(names).includes(provider.pluginName))
    .map((provider) => ({ pluginName: provider.pluginName, ...provider.params }));
}

module.exports = { getByNames };
