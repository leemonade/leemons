const { tables } = require('../tables');
const { getByIds: getAssets } = require('./getByIds');
const { getByCategory: getByPermissions } = require('../permissions/getByCategory');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches public assets based on the provided parameters.
 *
 * @async
 * @param {object} params - The parameters object.
 * @param {boolean} params.includePublic - Flag to include public assets in the response.
 * @param {string} params.categoryId - The ID of the category to fetch assets from.
 * @param {boolean} params.indexable - Flag to include indexable assets in the response.
 * @param {object} params.transacting - The transaction object.
 * @returns {Promise<Array>} An array of public assets.
 */
async function getPublicAssets({ includePublic, categoryId, indexable, transacting }) {
  let publicAssets = [];

  if (includePublic) {
    publicAssets = await tables.assets.find(
      { category: categoryId, public: true, indexable },
      { columns: ['id'], transacting }
    );
  }

  return publicAssets;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetches assets by user and category.
 *
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
    // Must include private and public assets
    const privateAssets = await getByPermissions(categoryId, {
      indexable,
      userSession,
      transacting,
    });
    const publicAssets = await getPublicAssets({
      includePublic,
      categoryId,
      indexable,
      transacting,
    });

    const assets = privateAssets.concat(publicAssets).map((item) => item.id || item.asset);

    if (details) {
      return getAssets(assets, { transacting });
    }
    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get category assets: ${e.message}`);
  }
}

module.exports = { getByCategory: getByUserAndCategory };
