const { fetchAssetFilesByAssets } = require('./fetchAssetFilesByAssets');
const { fetchAssetFilesByType } = require('./fetchAssetFilesByType');

/**
 * Fetches the assets by type.
 *
 * @param {string|array} type - The file type or list of file types to filter by
 * @param {Object} options - The options.
 * @param {Array} options.assets - The assets.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @returns {Promise<Array>} The assets.
 */
async function getAssetsByType({ type, assets, ctx }) {
  const fileIds = await fetchAssetFilesByAssets({ assets, ctx });
  const assetFiles = await fetchAssetFilesByType({ type, fileIds, ctx });

  return assetFiles.map(({ asset }) => asset);
}
module.exports = { getAssetsByType };
