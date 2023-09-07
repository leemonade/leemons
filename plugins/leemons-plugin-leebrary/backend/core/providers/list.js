const { getPluginProviders } = require('leemons-providers');

/**
 * This function lists all the providers available in the plugin.
 *
 * @param {Object} params - The params object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} - Returns an array of plugin providers.
 */
async function list({ ctx }) {
  return getPluginProviders({ keyValueModel: ctx.tx.db.KeyValue, raw: true });
}

module.exports = { list };
