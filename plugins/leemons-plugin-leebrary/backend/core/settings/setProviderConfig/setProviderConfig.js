const { LeemonsError } = require('@leemons/error');
const { setActiveProvider } = require('../setActiveProvider');
const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * This function sets the configuration for a specific provider.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.providerName - The name of the provider for which to set the configuration.
 * @param {Object} params.config - The configuration to be set for the provider.
 * @param {MoleculerContext} params.ctx - The context object containing additional information.
 * @returns {Promise} - A promise that resolves when the configuration has been successfully set.
 * @throws {Error} If the function is not called from leemons-plugin-leebrary.
 * @throws {LeemonsError} If the provider is not found or does not support the setConfig method.
 */
async function setProviderConfig({ providerName, config, ctx } = {}) {
  if (!['bulk-data', 'admin', 'leebrary', 'client-manager'].includes(ctx.callerPlugin)) {
    throw new Error('Must be called from leemons-plugin-leebrary');
  }

  const provider = await getProviderByName({ name: providerName, ctx });

  if (!provider) {
    throw new LeemonsError(ctx, {
      message: `The provider "${providerName}" not found`,
      httpStatusCode: 412,
    });
  }

  if (!provider.supportedMethods?.setConfig) {
    throw new LeemonsError(ctx, {
      message:
        'Bad implementation for media library, the service provider need the function: setConfig',
      httpStatusCode: 412,
    });
  }

  await setActiveProvider({ providerName, ctx });
  return ctx.tx.call(`${provider.pluginName}.config.setConfig`, { config });
}

module.exports = { setProviderConfig };
