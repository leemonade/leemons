const { isEmpty } = require('lodash');
const { getByIds: getAssetsByIds } = require('../assets/getByIds');
const { tables } = require('../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * @function buildQuery
 * @description Builds the query object for the assets table.
 * @param {string} description - The description to search for.
 * @param {boolean} indexable - Whether the asset is indexable.
 * @param {Array} assetsIds - The IDs of the assets.
 * @returns {Object} The query object.
 */
function buildQuery(description, indexable, assetsIds) {
  const query = {
    description_$contains: description,
    indexable,
  };

  if (!isEmpty(assetsIds)) {
    query.id_$in = assetsIds;
  }

  return query;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * @function byDescription
 * @description Searches for assets by description.
 * @param {string} description - The description to search for.
 * @param {Object} options - The options for the search.
 * @param {boolean} options.details - Whether to return detailed results.
 * @param {boolean} options.indexable - Whether the asset is indexable.
 * @param {Array} options.assets - The IDs of the assets.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The IDs of the matching assets, or the detailed assets if details is true.
 */
async function byDescription(
  description,
  { details = false, indexable = true, assets: assetsIds, transacting } = {}
) {
  try {
    const query = buildQuery(description, indexable, assetsIds);

    let assets = await tables.assets.find(query, { columns: ['id'], transacting });
    assets = assets.map((entry) => entry.id);

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }
    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with description: ${e.message}`);
  }
}

module.exports = { byDescription };
