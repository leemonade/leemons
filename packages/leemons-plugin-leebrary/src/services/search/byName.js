const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByIds: getAssetsByIds } = require('../assets/getByIds');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * @function buildQuery
 * @description Builds the query object for the assets table.
 * @param {string} name - The name to search for.
 * @param {boolean} indexable - Whether the asset is indexable.
 * @param {Array} assetsIds - The IDs of the assets.
 * @returns {Object} The query object.
 */
function buildQuery(name, indexable, assetsIds) {
  const query = {
    name_$contains: name,
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
 * @function byName
 * @description Searches for assets by name.
 * @param {string} name - The name to search for.
 * @param {Object} options - The options for the search.
 * @param {boolean} options.details - Whether to return detailed results.
 * @param {boolean} options.indexable - Whether the asset is indexable.
 * @param {Array} options.assets - The IDs of the assets.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The IDs of the matching assets, or the detailed assets if details is true.
 */
async function byName(
  name,
  { details = false, indexable = true, assets: assetsIds, transacting } = {}
) {
  try {
    const query = buildQuery(name, indexable, assetsIds);

    let assets = await tables.assets.find(query, { columns: ['id'], transacting });
    assets = assets.map((entry) => entry.id);

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }

    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with name: ${e.message}`);
  }
}

module.exports = { byName };
