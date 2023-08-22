const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByIds } = require('./getByIds');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Build the query object for fetching assets by category
 * @param {string} categoryId - The category ID
 * @param {boolean} indexable - The indexable flag
 * @param {Array} assetIds - The asset IDs
 * @returns {object} - Returns the query object
 */
function buildQuery(categoryId, indexable, assetIds) {
  const query = {
    category: categoryId,
    indexable,
  };

  if (!isEmpty(assetIds)) {
    query.id_$in = assetIds;
  }

  return query;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetch assets by category
 * @param {string} categoryId - The category ID
 * @param {object} options - The options object
 * @param {boolean} options.details - The details flag
 * @param {boolean} options.indexable - The indexable flag
 * @param {Array} options.assets - The asset IDs
 * @param {object} options.transacting - The transaction object
 * @returns {Array} - Returns an array of assets or asset IDs
 */
async function getByCategory(
  categoryId,
  { details = false, indexable = true, assets: assetIds, transacting } = {}
) {
  try {
    const query = buildQuery(categoryId, indexable, assetIds);
    const assets = await tables.assets.find(query, { transacting });

    if (details) {
      return getByIds(
        assets.map(({ id }) => id),
        { transacting }
      );
    }
    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get category assets: ${e.message}`);
  }
}

module.exports = { getByCategory };
