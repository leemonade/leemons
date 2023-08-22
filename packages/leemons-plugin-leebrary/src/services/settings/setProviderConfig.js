const { tables } = require('../tables');
const { setActiveProvider } = require('./setActiveProvider');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Check if the call is from a valid plugin
 * @param {string} calledFrom - The name of the plugin that made the call
 * @throws {Error} If the call is not from a valid plugin
 */
function validatePluginCall(calledFrom) {
  const validPlugins = ['plugins.bulk-template', 'plugins.admin', 'plugins.leebrary'];
  if (!validPlugins.includes(calledFrom)) {
    throw new Error('Must be called from leemons-plugin-leebrary');
  }
}

/**
 * Validate the provider and its services
 * @param {Object} provider - The provider to validate
 * @param {string} providerName - The name of the provider
 * @throws {HttpError} If the provider or its services are not valid
 */
function validateProvider(provider, providerName) {
  if (!provider || !provider.services || !provider.services.provider) {
    throw new global.utils.HttpError(412, 'Bad implementation for media library, need the service: provider');
  }
  if (!provider.services.provider.setConfig) {
    throw new global.utils.HttpError(412, 'Bad implementation for media library, the service provider need the function: setConfig');
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Set the configuration for a provider
 * @async
 * @param {string} providerName - The name of the provider
 * @param {Object} config - The configuration to set
 * @param {Object} options - The options for the transaction
 * @param {Object} options.transacting - The transaction object
 * @returns {Promise} The result of the provider's setConfig function
 * @throws {HttpError} If the provider is not found
 */
async function setProviderConfig(providerName, config, { transacting: t } = {}) {
  validatePluginCall(this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      const provider = leemons.getProvider(providerName);
      validateProvider(provider, providerName);

      await setActiveProvider(providerName, { transacting });
      return provider.services.provider.setConfig(config, { transacting });
    },
    tables.settings,
    t
  );
}

module.exports = { setProviderConfig };
