const { tables } = require('../tables');
const { getByIds } = require('./getByIds');

/**
 * Fetches categories by asset ID.
 * @async
 * @param {string} assetId - The ID of the asset.
 * @param {Object} [options] - Optional parameters.
 * @param {Object} [options.transacting] - The transaction object.
 * @returns {Promise<Array>} A promise that resolves to an array of categories.
 * @throws {HttpError} Throws an HTTP error if the operation fails.
 */
async function getByAsset(assetId, { transacting } = {}) {
  try {
    const categories = await tables.assetCategories.find({ asset: assetId }, { transacting });
    return getByIds(categories.map(({ category }) => category));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get categories: ${e.message}`);
  }
}

module.exports = { getByAsset };
