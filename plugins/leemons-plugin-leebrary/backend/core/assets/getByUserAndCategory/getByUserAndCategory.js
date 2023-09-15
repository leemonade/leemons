const { LeemonsError } = require('@leemons/error');
const { getByIds: getAssets } = require('../getByIds/getByIds');
const { getByCategory: getByPermissions } = require('../../permissions/getByCategory');
const { getPublicAssets } = require('./getPublicAssets');

/**
 * Fetches assets by user and category.
 *
 * @async
 * @param {object} params - The params object.
 * @param {string} params.categoryId - The ID of the category to fetch assets from.
 * @param {boolean} [params.details] - Flag to include details in the response. Defaults to false.
 * @param {boolean} [params.includePublic] - Flag to include public assets in the response. Defaults to false
 * @param {boolean} [params.indexable]- Flag to include indexable assets in the response (default: true). Defaults to false
 * @param {MoleculerContext} ctx - The Moleculer context object.
 * @returns {Promise<Array>} An array of assets.
 */
async function getByUserAndCategory({
  categoryId,
  details = false,
  includePublic = false,
  indexable = true,
  ctx,
}) {
  try {
    // Must include private and public assets
    const privateAssets = await getByPermissions({ categoryId, indexable, ctx });
    const publicAssets = await getPublicAssets({
      includePublic,
      categoryId,
      indexable,
      ctx,
    });

    const assets = privateAssets.concat(publicAssets).map((item) => item.id || item.asset);

    if (details) {
      return getAssets({ ids: assets, ctx });
    }
    return assets;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get category assets: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByCategory: getByUserAndCategory };
