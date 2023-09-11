const { isArray } = require('lodash');

/**
 * Get the files associated with multiple assets
 *
 * @param {Array|string} assetIds - The IDs of the assets
 * @param {MoleculerContext} ctx - The moleculer context.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of files linked to the assets
 */
async function getByAssets({ assetIds, ctx }) {
  const ids = isArray(assetIds) ? assetIds : [assetIds];
  return ctx.tx.db.AssetsFiles.find({ asset: ids }).lean();
}

module.exports = { getByAssets };
