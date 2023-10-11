const { set: updateSettings } = require('../set');

/**
 * This function sets the active provider for the settings.
 *
 * @param {Object} params - An object.
 * @param {string} params.providerName - The name of the provider to be set as active.
 * @param {MoleculerContext} params.ctx - The context object containing transaction details.
 * @returns {Promise} A promise that resolves with the updated settings.
 */
async function setActiveProvider({ providerName, ctx } = {}) {
  return updateSettings({ settings: { providerName }, ctx });
}

module.exports = { setActiveProvider };
