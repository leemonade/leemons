const { isEmpty, keyBy, forEach, map, sortBy } = require('lodash');

const { getByIds: getAssetsByIds } = require('../../assets/getByIds');
/**
 * Sorts the provided assets based on the given criteria.
 *
 * @param {Object} params - The parameters for sorting.
 * @param {string} params.sortingBy - The field to sort by.
 * @param {Array} params.assets - The assets to be sorted.
 * @param {boolean} params.indexable - Flag to indicate if the assets should be indexable.
 * @param {boolean} params.showPublic - Flag to indicate if the assets should be public.
 * @param {string} params.sortDirection - The direction of the sort ('asc' or 'desc').
 * @param {Object} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} - Returns a promise that resolves with the sorted assets.
 */

async function sortAssets({ sortingBy, assets, indexable, showPublic, sortDirection, ctx }) {
  // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
  // EN: For the case that you need sorting, we need a different logic

  let result = assets;

  if (sortingBy && !isEmpty(sortingBy)) {
    const [items] = await Promise.all([
      getAssetsByIds({
        ids: map(assets, 'asset'),
        withCategory: false,
        withTags: false,
        indexable,
        showPublic,
        ctx,
      }),
    ]);

    let sortedAssets = sortBy(items, sortingBy);

    if (sortDirection === 'desc') {
      sortedAssets = sortedAssets.reverse();
    }

    const assetIds = sortedAssets.map((item) => item.id);
    result = [];
    const resultByAsset = keyBy(assets, 'asset');
    forEach(assetIds, (assetId) => {
      if (resultByAsset[assetId]) {
        result.push(resultByAsset[assetId]);
      }
    });
  }

  return result;
}

module.exports = {
  sortAssets,
};
