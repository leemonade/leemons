const { isEmpty, map, intersection, flattenDeep, compact, uniq } = require('lodash');

const { byProvider: getByProvider } = require('../byProvider');
/**
 * This function retrieves provider assets based on the provided parameters.
 * It first checks if the search is to be conducted in the provider and if a category ID and criteria are provided.
 * If so, it fetches the provider assets using the provided parameters.
 * If no provider assets are found, it returns the initial assets and a flag indicating that nothing was found.
 * If provider assets are found, it constructs a query object and uses it to fetch assets from the database.
 * The function then checks if any assets were found and if not, it returns the initial assets and a flag indicating that nothing was found.
 * If assets were found, it intersects them with the initial assets if any, or concatenates them with the initial assets if none.
 * Finally, it returns the assets and a flag indicating if no assets were found.
 *
 * @param {Object} params - The parameters object.
 * @param {Array} params.assets - The initial array of assets.
 * @param {string} params.categoryId - The category ID.
 * @param {string} params.criteria - The search criteria.
 * @param {boolean} params.indexable - Flag to indicate if the assets should be indexable.
 * @param {boolean} params.nothingFound - Flag to indicate if no assets were found.
 * @param {boolean} params.pinned - Flag to indicate if pinned assets should be retrieved.
 * @param {boolean} params.preferCurrent - Flag to indicate if current assets should be preferred.
 * @param {Object} params.providerQuery - The provider query object.
 * @param {boolean} params.published - Flag to indicate if the assets should be published.
 * @param {boolean} params.searchInProvider - Flag to indicate if the search should be conducted in the provider.
 * @param {Object} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} - Returns an object containing the retrieved assets and a flag indicating if no assets were found.
 */

async function getProviderAssets({
  assets: _assets,
  categoryId,
  criteria,
  indexable,
  nothingFound: _nothingFound,
  pinned,
  preferCurrent,
  providerQuery,
  published,
  searchInProvider,
  ctx,
}) {
  let providerAssets = null;

  let nothingFound = _nothingFound;
  let assets = _assets;

  if (searchInProvider && categoryId && !isEmpty(criteria)) {
    providerAssets = await getByProvider({
      categoryId,
      criteria,
      query: providerQuery,
      assets,
      published,
      preferCurrent,
      ctx,
    });

    nothingFound = !providerAssets?.length;
  }

  if (providerAssets?.length === 0) {
    return { assets, nothingFound };
  }

  const query = {
    indexable,
  };

  if (criteria) {
    query.$or = [
      { name: { $regex: criteria, $options: 'i' } },
      { tagline: { $regex: criteria, $options: 'i' } },
      { description: { $regex: criteria, $options: 'i' } },
    ];
  }

  const assetIds = providerAssets || assets;
  if (!isEmpty(assetIds) || pinned) {
    query.id = assetIds;
  }

  if (categoryId) {
    query.category = categoryId;
  }

  const [assetsFound, byTags] = await Promise.all([
    ctx.tx.db.Assets.find(query).select('id').lean(),
    ctx.tx.call('common.tags.getTagsValueByPartialTags', {
      values: criteria,
      type: ctx.prefixPN(''),
    }),
  ]);

  const matches = map(assetsFound, 'id');
  // ES: Si existen recursos, se debe a un filtro previo que debemos aplicar como intersección
  // EN: If there are resources, we must apply a previous filter as an intersection
  if (isEmpty(criteria)) {
    assets = matches;
  } else if (!isEmpty(assets)) {
    assets = intersection(matches, compact(uniq(flattenDeep(byTags))));
  } else {
    assets = compact(uniq(matches.concat(flattenDeep(byTags))));
  }

  nothingFound = assets.length === 0;

  return { assets, nothingFound };
}

module.exports = { getProviderAssets };
