const { getByIds: getAssetsByIds } = require('../assets/getByIds');
const { getById: getCategoryById } = require('../categories/getById');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * @function getCategory
 * @description Fetches the category by ID if not provided.
 * @param {string} categoryId - The ID of the category.
 * @param {string} category - The category object.
 * @param {Object} transacting - The transaction object.
 * @returns {Object} The category object.
 */
async function getCategory(categoryId, category, transacting) {
  if (!category && categoryId) {
    // eslint-disable-next-line no-param-reassign
    category = await getCategoryById(categoryId, { transacting });
  }

  if (!category) {
    throw new global.utils.HttpError(400, 'Category is required');
  }

  return category;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * @function byProvider
 * @description Fetches assets by provider.
 * @param {string} categoryId - The ID of the category.
 * @param {Object} criteria - The search criteria.
 * @param {Object} options - The options object.
 * @returns {Promise<Array>} The IDs of the matching assets, or the detailed assets if details is true.
 */
async function byProvider(
  categoryId,
  criteria,
  {
    query,
    details = false,
    assets: assetsIds,
    category,
    published,
    preferCurrent,
    userSession,
    transacting,
  } = {}
) {
  category = await getCategory(categoryId, category, transacting);

  try {
    const provider = leemons.getProvider(category.provider) || leemons.getPlugin(category.provider);

    if (typeof provider?.services?.assets?.search !== 'function') {
      return null;
    }

    const assets = await provider.services.assets.search(criteria, {
      query,
      category,
      assets: assetsIds,
      published,
      preferCurrent,
      userSession,
      transacting,
    });

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }

    return assets;
  } catch (e) {
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to find asset in provider: ${e.message}`);
  }
}

module.exports = { byProvider };
