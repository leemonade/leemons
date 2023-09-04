const { isArray, uniq, isEmpty } = require('lodash');
const { getByAssets: getFilesByAssets } = require('../assets/files/getByAssets');
const { getByFiles: getAssetsByFiles } = require('../assets/files/getByFiles');
const { getByType } = require('./getByType');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches the asset files by assets.
 * 
 * @param {Object} params - The params object.
 * @param {Array} params.assets - The assets.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Array>} The asset files.
 */
async function fetchAssetFilesByAssets({ assets, transacting }) {
  if (!assets || isEmpty(assets)) {
    return [];
  }

  const ids = isArray(assets) ? assets : [assets];
  const assetFiles = await getFilesByAssets(ids, { transacting });

  return uniq(assetFiles.map((item) => item.file));
}

/**
 * Fetches the asset files by type.
 * 
 * @param {Object} params - The params object.
 * @param {string} params.type - The type.
 * @param {Array} params.fileIds - The file IDs.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Array>} The asset files.
 */
async function fetchAssetFilesByType({ type, fileIds, transacting }) {
  const files = await getByType(type, { files: fileIds, transacting });

  return getAssetsByFiles(files.map(({ id }) => id), { transacting });
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetches the assets by type.
 * 
 * @param {string} type - The type.
 * @param {Object} options - The options.
 * @param {Array} options.assets - The assets.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The assets.
 */
async function getAssetsByType(type, { assets, transacting }) {
  const fileIds = await fetchAssetFilesByAssets({ assets, transacting });
  const assetFiles = await fetchAssetFilesByType({ type, fileIds, transacting });

  return assetFiles.map(({ asset }) => asset);
}
module.exports = { getAssetsByType };
