const { tables } = require('../tables');

/**
 * Check if an asset exists by its ID
 * @param {string} assetId - The ID of the asset
 * @param {object} transacting - The transaction object
 * @returns {Promise<boolean>} - Returns true if the asset exists, false otherwise
 */
async function exists(assetId, { transacting } = {}) {
  const count = await tables.assets.count({ id: assetId }, { transacting });
  return count > 0;
}

module.exports = { exists };
