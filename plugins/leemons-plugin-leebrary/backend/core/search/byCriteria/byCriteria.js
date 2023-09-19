/**
 * This function performs a search operation based on the provided criteria.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.criteria - The search criteria.
 * @param {string} params.type - The type of the asset to be searched.
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
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} - Returns the search results.
 */
const { isObject } = require('lodash');

const { LeemonsError } = require('@leemons/error');

const { getCategoryId } = require('./getCategoryId');
const { getPinnedAssets } = require('./getPinnedAssets');
const { getProviderAssets } = require('./getProviderAssets');
const { getAssets } = require('./getAssets');
const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');
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
  ctx,
}) {
  let published = _published;
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

  let assets = [];
  let nothingFound = false;

  if (pinned) {
    published = 'all';
    preferCurrent = false;
  }

  try {
    const categoryId = await getCategoryId({ category, ctx });

    ({ assets, nothingFound } = await getPinnedAssets({ pinned, ctx }));

    ({ assets, nothingFound } = await getProviderAssets({
      assets,
      categoryId,
      criteria,
      indexable,
      nothingFound,
      pinned,
      preferCurrent,
      providerQuery,
      published,
      searchInProvider,
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
    ctx.logger.log(e);

    throw new LeemonsError(ctx, {
      message: `Failed to find asset with query: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { byCriteria };
