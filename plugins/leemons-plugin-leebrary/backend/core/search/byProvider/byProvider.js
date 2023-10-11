const { LeemonsError } = require('@leemons/error');

const { getByIds: getAssetsByIds } = require('../../assets/getByIds');
const { getById: getCategoryById } = require('../../categories/getById');
const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * @function byProvider
 * @description This function searches for assets by provider.
 * @param {Object} params - The parameters for the search.
 * @param {string} params.categoryId - The ID of the category.
 * @param {Object} params.criteria - The criteria for the search.
 * @param {string} params.query - The query for the search.
 * @param {boolean} [params.details=false] - Whether to return detailed results.
 * @param {Array} params.assets - The IDs of the assets.
 * @param {Object} params.category - The category of the assets.
 * @param {boolean} params.published - Whether the assets are published.
 * @param {boolean} params.preferCurrent - Whether to prefer current assets.
 * @param {Object} params.ctx - The context for the search.
 * @returns {Promise<Array>} The found assets.
 * @throws {LeemonsError} If the category is not provided or if the search fails.
 */
async function byProvider({
  categoryId,
  criteria,
  query,
  details = false,
  assets: assetsIds,
  category,
  published,
  preferCurrent,
  ctx,
}) {
  if (!category && categoryId) {
    // eslint-disable-next-line no-param-reassign
    category = await getCategoryById({ id: categoryId, ctx });
  }

  if (!category) {
    throw new LeemonsError(ctx, { message: 'Category is required', httpStatusCode: 400 });
  }

  try {
    const provider = await getProviderByName({ name: category.provider, ctx });

    if (!provider?.supportedMethods?.search) {
      return null;
    }

    const assets = await ctx.tx.call(`${category.provider}.assets.search`, {
      criteria,
      query,
      category,
      assets: assetsIds,
      published,
      preferCurrent,
    });

    if (details) {
      return getAssetsByIds({ ids: assets, ctx });
    }

    return await assets;
  } catch (e) {
    ctx.logger.error(e);
    throw new LeemonsError(ctx, {
      message: `Failed to find asset in provider: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { byProvider };
