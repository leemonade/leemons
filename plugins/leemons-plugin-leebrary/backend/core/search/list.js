const _ = require('lodash');

const { getByCategory } = require('../permissions/getByCategory');

const { byAddons: getByAddons } = require('./byAddons');
const { byCriteria: getByCriteria } = require('./byCriteria');
const { searchAssetsCacheKey } = require('./helpers/cacheKeys');

async function list({
  category,
  criteria,
  type,
  published,
  preferCurrent,
  showPublic,
  searchInProvider,
  roles,
  providerQuery,
  programs,
  subjects,
  onlyShared,
  categoryFilter,
  categoriesFilter,
  hideCoverAssets,

  indexable = true, // !important: This param is not intended for API use, as it will expose hidden assets

  ctx,
  useCache,
  addons,
}) {
  const trueValues = ['true', true, '1', 1];

  let assets = [];
  const publishedStatus =
    published === 'all' ? published : [...trueValues, 'published'].includes(published);
  const displayPublic = trueValues.includes(showPublic);
  const searchProvider = trueValues.includes(searchInProvider);
  const preferCurrentValue = trueValues.includes(preferCurrent);
  const _hideCoverAssets = trueValues.includes(hideCoverAssets);
  const _onlyShared = trueValues.includes(onlyShared);
  const _indexable = trueValues.includes(indexable);
  const parsedRoles = JSON.parse(roles || null) || [];
  const _providerQuery = JSON.parse(providerQuery || null);
  const _programs = JSON.parse(programs || null);
  const _subjects = JSON.parse(subjects || null);
  const _categoriesFilter = JSON.parse(categoriesFilter || null); // added to filter by multiple categories

  const shouldSearchByCriteria = !_.isEmpty(criteria) || !_.isEmpty(type) || _.isEmpty(category);

  let query = null;
  let searchFunction = null;

  if (shouldSearchByCriteria) {
    searchFunction = getByCriteria;
    query = {
      category: category || categoryFilter,
      criteria,
      type,
      indexable: _indexable,
      published: publishedStatus,
      showPublic: displayPublic,
      preferCurrent: preferCurrentValue,
      roles: parsedRoles,
      searchInProvider: searchProvider,
      providerQuery: _providerQuery,
      programs: _programs,
      subjects: _subjects,
      onlyShared: _onlyShared,
      categoriesFilter: _categoriesFilter,
      hideCoverAssets: _hideCoverAssets,
      sortBy: 'updated_at',
      sortDirection: 'desc',
      addons,
    };
  } else {
    searchFunction = getByCategory;
    query = {
      category,
      published: publishedStatus,
      indexable: _indexable,
      preferCurrent: preferCurrentValue,
      showPublic: displayPublic,
      roles: parsedRoles,
      searchInProvider: searchProvider,
      providerQuery: _providerQuery,
      programs: _programs,
      subjects: _subjects,
      onlyShared: _onlyShared, // not used within getByCategory()
      sortBy: 'updated_at',
      sortDirection: 'desc',
      addons,
    };
  }

  // ···················
  // Cache

  const cacheKey = searchAssetsCacheKey({ ctx, query });
  let cache = null;

  if (useCache && cacheKey) {
    cache = await ctx.cache.get(cacheKey);
  }

  if (cache) {
    assets = cache;
  } else {
    let addonAssetsFound = true;

    if (addons?.length) {
      assets = await getByAddons({ pluginNames: addons, ctx, query });
      addonAssetsFound = assets.length > 0;
    }

    if (addonAssetsFound) {
      assets = await searchFunction({
        ...query,
        assets,
        ctx,
      });
    }

    await ctx.cache.set(cacheKey, assets, 60); // 1 minute
  }

  // TODO: Temporary solution
  if (parsedRoles?.length === 1 && parsedRoles[0] === 'owner') {
    assets = assets.filter((asset) => asset.role === 'owner');
  }

  return assets;
}

module.exports = {
  list,
};
