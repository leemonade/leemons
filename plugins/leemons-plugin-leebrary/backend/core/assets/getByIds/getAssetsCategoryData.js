const { uniq } = require('lodash');
const { getByIds: getCategories } = require('../../categories/getByIds');
/**
 * Fetches category data associated with each asset
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch category data for
 * @param {UserSession} params.userSession - The user session object
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of categories and asset category data
 */
async function getAssetsCategoryData({ assets, ctx }) {
  const { userSession } = ctx.meta;
  const categoryIds = uniq(assets.map((item) => item.category));
  const categories = await getCategories({ categoryIds, ctx });

  // CATEGORY ROVIDER DATA
  const providersResults = await Promise.all(
    categories.map((category) => {
      if (category.provider === 'leebrary') {
        return null;
      }

      const categoryProvider = category.provider;
      const assetProviderService = leemons.getProvider(categoryProvider).services.assets;
      return assetProviderService.getByIds(
        assets
          .filter((item) => item.category === category.id)
          .map((item) => ({ ...item, category })),
        { userSession, transacting }
      );
    })
  );

  const assetCategoryData = providersResults.flat();

  return [categories, assetCategoryData];
}
module.exports = { getAssetsCategoryData };
