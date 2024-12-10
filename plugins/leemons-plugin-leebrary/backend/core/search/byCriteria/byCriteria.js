/**
 * This function performs a search operation based on the provided criteria.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.criteria - The search criteria.
 * @param {string|array} params.type - The file type or list of file types to filter by
 * @param {string} params.category - The category of the asset to be searched.
 * @param {boolean} params.allVersions - Flag to include all versions of the asset in the search.
 * @param {string} params.sortBy - The field to sort the search results by.
 * @param {string} params.sortDirection - The direction to sort the search results in.
 * @param {boolean} params.published - Flag to include only published assets in the search.
 * @param {boolean} params.indexable - Flag to include only indexable assets in the search.
 * @param {boolean} params.preferCurrent - Flag to prefer current versions of the asset in the search.
 * @param {boolean} params.searchInProvider - Flag to perform the search in the provider.
 * @param {Object} params.providerQuery - The query to be used when searching in the provider.
 * @param {boolean} params.pinned - Flag to include only pinned assets in the search.
 * @param {boolean} params.showPublic - Flag to include only public assets in the search.
 * @param {Array} params.roles - The roles to be included in the search.
 * @param {boolean} params.onlyShared - Flag to include only shared assets in the search.
 * @param {Array} params.programs - The programs to be included in the search.
 * @param {Array} params.subjects - The subjects to be included in the search.
 * @param {Array} params.categoriesFilter - The categories to be included in the search.
 * @param {boolean} params.hideCoverAssets - Flag to hide cover assets in the search.
 * @param {Array} params.assets - The assetIds to filter by.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} - Returns the search results.
 */
const { LeemonsError } = require('@leemons/error');
const { isObject } = require('lodash');

const { getAssets } = require('./getAssets');
const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');
const { getCategoryId } = require('./getCategoryId');
const { getPinnedAssets } = require('./getPinnedAssets');
const { getProviderAssets } = require('./getProviderAssets');
const { sortAssets } = require('./sortAssets');

async function byCriteria({
  criteria = '',
  type,
  category,
  // allVersions = false, // unused Param
  sortBy: sortingBy,
  sortDirection = 'asc',
  published: _published = true,
  indexable = true,
  preferCurrent: _preferCurrent,
  searchInProvider,
  providerQuery: _providerQuery = {},
  pinned,
  showPublic,
  roles,
  onlyShared,
  programs: _programs,
  subjects: _subjects,
  categoriesFilter,
  hideCoverAssets,
  ctx,
  assets = [], // AssetIds
}) {
  const published = _published;
  let preferCurrent = _preferCurrent;
  let providerQuery = _providerQuery;
  let programs = _programs;
  let subjects = _subjects;

  if (!isObject(providerQuery)) {
    providerQuery = {};
  }

  if (!programs && providerQuery?.program) {
    programs = [providerQuery.program];
  }
  if (!subjects && providerQuery?.subjects) {
    subjects = providerQuery.subjects;
  }

  if (!providerQuery?.program && programs) {
    [providerQuery.program] = programs;
  }
  if (!providerQuery?.subjects && subjects) {
    providerQuery.subjects = subjects;
  }

  let nothingFound = false;

  if (pinned) {
    preferCurrent = false;
  }

  try {
    const categoryId = await getCategoryId({ category, ctx });

    // If there are no assets, get the pinned assets to start the search
    if (!assets?.length) {
      ({ assets, nothingFound } = await getPinnedAssets({ pinned, ctx }));
    }

    ({ assets, nothingFound } = await getProviderAssets({
      assets,
      categoryId,
      categoriesFilter,
      criteria,
      indexable,
      nothingFound,
      pinned,
      preferCurrent,
      providerQuery,
      published,
      searchInProvider,
      hideCoverAssets,
      ctx,
    }));

    ({ assets, nothingFound } = await getAssets({
      assets,
      indexable,
      nothingFound,
      onlyShared,
      programs,
      subjects,
      type,
      ctx,
    }));

    assets = await getAssetsWithPermissions({
      assets,
      nothingFound,
      onlyShared,
      preferCurrent,
      published,
      roles,
      showPublic,
      ctx,
    });

    return await sortAssets({
      assets,
      indexable,
      showPublic,
      sortDirection,
      sortingBy,
      ctx,
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to find asset with query: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { byCriteria };
