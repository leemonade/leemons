const { isEmpty } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getByIds } = require('../getByIds/getByIds');

/**
 * Fetch assets by category
 *
 * @param {string} categoryId - The category ID
 * @param {object} options - The options object
 * @param {boolean} [options.details] - The details flag
 * @param {boolean} [options.indexable] - The indexable flag
 * @param {Array<string>} [options.assets] - The asset IDs
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<Array<LibraryAsset|string>>} - Returns an array of assets or asset IDs
 * @throws {LeemonsError} - Throws an error if unable to fetch assets by category
 */
async function getByCategory({
  categoryId,
  details = false,
  indexable = true,
  assets: assetIds,
  ctx,
}) {
  try {
    const query = {
      category: categoryId,
      indexable,
    };

    if (!isEmpty(assetIds)) {
      query.id = assetIds;
    }

    const assets = await ctx.tx.db.Assets.find(query).sort({ id: 'asc' }).lean();

    if (details) {
      return getByIds({
        assetsIds: assets.map(({ id }) => id),
        ctx,
      });
    }
    return assets;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get category assets: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByCategory };
