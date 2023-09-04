const { tables } = require('../../tables');
const { normalizeItemsArray } = require('../../shared');

/**
 * Removes files and associated assets from the database.
 * 
 * @param {Array|string} fileIds - The IDs of the files to be removed.
 * @param {string} assetId - The ID of the associated asset.
 * @param {object} options - The options object.
 * @param {boolean} options.soft - Whether to perform a soft delete. Default is false.
 * @param {object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating whether the operation was successful.
 */
async function remove(fileIds, assetId, { soft, transacting } = {}) {
  const query = {
    file_$in: normalizeItemsArray(fileIds),
  };

  if (assetId) {
    query.asset = assetId;
  }

  const deleted = await tables.assetsFiles.deleteMany(query, { soft, transacting });

  return deleted.count > 0;
}

module.exports = { remove };
