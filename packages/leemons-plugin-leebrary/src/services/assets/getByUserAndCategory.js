const { tables } = require('../tables');
const { getByIds: getAssets } = require('./getByIds');
const { getByCategory: getByPermissions } = require('../permissions/getByCategory');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches public assets based on the provided category ID and indexable status.
 * @async
 * @param {string} categoryId - The ID of the category to fetch assets from.
 * @param {boolean} indexable - Flag to include indexable assets in the response.
 * @param {object} transacting - The transaction object.
 * @returns {Promise<Array>} An array of public assets.
 */
async function getPublicAssets(categoryId, indexable, transacting) {
  return await tables.assets.find(
    { category: categoryId, public: true, indexable },
    { columns: ['id'], transacting }
  );
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetches assets by user and category.
 * @async
 * @param {string} categoryId - The ID of the category to fetch assets from.
 * @param {object} options - The options object.
 * @param {boolean} options.details - Flag to include details in the response.
 * @param {boolean} options.includePublic - Flag to include public assets in the response.
 * @param {boolean} options.indexable - Flag to include indexable assets in the response (default: true).
 * @param {object} options.userSession - The user session object.
 * @param {object} options.transacting - The transaction object.
 * @returns {Promise<Array>} An array of assets.
 */
async function getByUserAndCategory(
  categoryId,
  { details = false, includePublic = false, indexable = true, userSession, transacting } = {}
) {
  try {
    const privateAssets = await getByPermissions(categoryId, {
      indexable,
      userSession,
      transacting,
    });

    const publicAssets = includePublic ? await getPublicAssets(categoryId, indexable, transacting) : [];

    const assets = [...privateAssets, ...publicAssets].map((item) => item.id || item.asset);

    return details ? await getAssets(assets, { transacting }) : assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get category assets: ${e.message}`);
  }
}

module.exports = { getByCategory: getByUserAndCategory };
