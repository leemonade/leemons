const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByIds: getAssetsByIds } = require('../assets/getByIds');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Build the query object for the assets search.
 * @param {string} tagline - The tagline to search for.
 * @param {boolean} indexable - If true, only indexable assets will be returned.
 * @param {Array} assetsIds - An array of asset IDs to limit the search to.
 * @returns {Object} The query object.
 */
function buildQuery(tagline, indexable, assetsIds) {
  const query = {
    tagline_$contains: tagline,
    indexable,
  };

  if (!isEmpty(assetsIds)) {
    query.id_$in = assetsIds;
  }

  return query;
}

/**
 * Fetch assets based on the provided query.
 * @param {Object} query - The query object.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Array>} An array of asset IDs.
 */
async function fetchAssets(query, transacting) {
  const assets = await tables.assets.find(query, { columns: ['id'], transacting });
  return assets.map((entry) => entry.id);
}

/**
 * Fetch assets by tagline.
 * @param {string} tagline - The tagline to search for.
 * @param {Object} options - The options object.
 * @param {boolean} options.details - If true, asset details will be returned.
 * @param {boolean} options.indexable - If true, only indexable assets will be returned.
 * @param {Array} options.assets - An array of asset IDs to limit the search to.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The IDs of the matching assets, or the detailed assets if details is true.
 */
async function byTagline(
  tagline,
  { details = false, indexable = true, assets: assetsIds, transacting } = {}
) {
  try {
    const query = buildQuery(tagline, indexable, assetsIds);
    const assets = await fetchAssets(query, transacting);

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }

    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with tagline: ${e.message}`);
  }
}

module.exports = { byTagline };
