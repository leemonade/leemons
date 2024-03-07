const { findAssignableByAssetIds } = require('../../assignables/findAssignableByAssetIds');

/**
 * Retrieves assignables by their asset IDs.
 *
 * @param {object} params - The params object.
 * @param {Array<string>} params.assetIds - The IDs of the assets to retrieve assignables for.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<object>>} - Returns a promise that resolves to an array of assignables.
 */
async function getByAssetIds({ assetIds, ctx }) {
  // To implement: this
  return findAssignableByAssetIds({ assets: assetIds, ctx });
}

module.exports = { getByAssetIds };
