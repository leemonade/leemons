const { isArray, uniq, isEmpty } = require('lodash');
const { getByAssets: getFilesByAssets } = require('../../assets/files/getByAssets');
/**
 * Fetches the asset files by assets.
 *
 * @param {Object} params - The params object.
 * @param {Array} params.assets - The assets.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise<Array>} The asset files.
 */
async function fetchAssetFilesByAssets({ assets, ctx }) {
  if (!assets || isEmpty(assets)) {
    return [];
  }

  const ids = isArray(assets) ? assets : [assets];
  const assetFiles = await getFilesByAssets({ assetIds: ids, ctx });

  return uniq(assetFiles.map((item) => item.file));
}
module.exports = { fetchAssetFilesByAssets };
