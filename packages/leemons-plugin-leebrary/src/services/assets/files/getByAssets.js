const { tables } = require('../../tables');
const { normalizeItemsArray } = require('../../shared');

/**
 * Get the files associated with multiple assets
 * @param {Array|string} assetIds - The IDs of the assets
 * @param {object} options - The options object
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of files associated with the assets
 */
async function getByAssets(assetIds, { transacting } = {}) {
  const ids = normalizeItemsArray(assetIds);
  return tables.assetsFiles.find(
    {
      asset_$in: ids,
    },
    { transacting }
  );
}

module.exports = { getByAssets };
