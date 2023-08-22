const getRolePermissions = require('./helpers/getRolePermissions');
const { find: findAsset } = require('../assets/find');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Build the query object for finding assets
 * @param {string} categoryId - The category ID
 * @param {boolean} indexable - Whether the asset is indexable
 * @returns {Object} - The query object
 */
function buildQuery(categoryId, indexable) {
  const query = { public: true, indexable };

  if (categoryId) {
    query.category = categoryId;
  }

  return query;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Get public assets
 * @param {string} categoryId - The category ID
 * @param {Object} options - Options object
 * @param {boolean} options.indexable - Whether the asset is indexable
 * @param {Object} options.transacting - Transaction object
 * @returns {Array} - The public assets
 * @throws {HttpError} - If there is an error getting the assets
 */
async function getPublic(categoryId, { indexable = true, transacting } = {}) {
  try {
    const query = buildQuery(categoryId, indexable);
    const publicAssets = await findAsset(query, { transacting });

    return publicAssets.map((asset) => ({
      asset: asset.id,
      role: 'public',
      permissions: getRolePermissions('public'),
    }));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getPublic };
