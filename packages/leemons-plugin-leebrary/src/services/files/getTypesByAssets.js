const { isArray, uniq } = require('lodash');
const { getByAssets: getFilesByAssets } = require('../assets/files/getByAssets');
const { getByIds } = require('./getByIds');

/**
 * Fetches file types by asset IDs.
 * 
 * @param {Array|string} assetIds - The asset IDs.
 * @param {Object} options - The options object.
 * @param {string} options.transacting - The transaction object.
 * @returns {Promise<Array>} The fetched file types.
 */
async function getTypesByAssets(assetIds, { transacting }) {
  const ids = isArray(assetIds) ? assetIds : [assetIds];
  const assetFiles = await getFilesByAssets(ids, { transacting });
  const fileIds = assetFiles.map((item) => item.file);
  const fileTypes = await getByIds(fileIds, { columns: ['type'], transacting });

  return uniq(fileTypes.map(({ type }) => type));
}
module.exports = { getTypesByAssets };
