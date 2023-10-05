const { uniq, compact } = require('lodash');
const { getByIds: getCategories } = require('../../categories/getByIds');
const { getByNames: getProviderByNames } = require('../../providers/getByNames');

/**
 * Fetches category data associated with each asset
 * @async
 * @param {Object} params - The params object
 * @param {Array<LibraryAsset>} params.assets - The assets to fetch category data for
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<Array>} - Returns an array of categories and asset category data
 */
async function getAssetsCategoryData({ assets, ctx }) {
  const categoryIds = uniq(assets.map((item) => item.category));
  const categories = await getCategories({ categoriesIds: categoryIds, ctx });

  // Extract unique provider names from the categories, excluding 'leebrary'
  const providersNames = uniq(categories.map((category) => category.provider)).filter(
    (provider) => provider !== 'leebrary'
  );
  const providers = await getProviderByNames({ names: compact(providersNames), ctx });

  // Fetch asset data for each category using the providers
  const providersResults = await Promise.all(
    categories.map(async (category) => {
      // Find the provider object for the current category
      const categoryProvider = providers.find(
        (provider) => provider.pluginName === category.provider
      );

      // If the provider supports the 'getByIds' methoda
      if (categoryProvider?.supportedMethods?.getByIds) {
        const categoryAssets = assets.filter((item) => item.category === category.id);

        // Call the 'getByIds' method on the provider to fetch asset data
        return ctx.tx.call(`${category.provider}.assets.getByIds`, {
          assetIds: categoryAssets.map((item) => item.id),
        });
      }

      return null;
    })
  );

  // Flatten the results from the providers into a single array
  const assetCategoryData = providersResults.flat();

  return [categories, assetCategoryData];
}
module.exports = { getAssetsCategoryData };
