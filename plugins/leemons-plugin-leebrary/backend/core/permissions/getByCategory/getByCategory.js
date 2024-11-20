/* eslint-disable no-param-reassign */
const { LeemonsError } = require('@leemons/error');
const { isEmpty, uniqBy, isBoolean } = require('lodash');

const { getAssetsByProgram } = require('../../assets/getAssetsByProgram');
const { getAssetsBySubject } = require('../../assets/getAssetsBySubject');
const { filterByPublishStatus } = require('../../search/byCriteria/filterByPublishStatus');
const { getCategoryId } = require('../../search/byCriteria/getCategoryId');
const { byProvider: getByProvider } = require('../../search/byProvider');
const { getPublic } = require('../getPublic/getPublic');

const { handleAssetIds } = require('./handleAssetIds');
const { handleAssignerRole } = require('./handleAssignerRole');
const { handleEditorRole } = require('./handleEditorRole');
const { handleIndexable } = require('./handleIndexable');
const { handleParams } = require('./handleParams');
const { handlePermissions } = require('./handlePermissions');
const { handlePermissionsRoles } = require('./handlePermissionsRoles');
const { handlePreferCurrent } = require('./handlePreferCurrent');
const { handleSorting } = require('./handleSorting');
const { handleViewerRole } = require('./handleViewerRole');

/**
 * This function retrieves permissions by category.
 *
 * @param {Object} params - An object containing various parameters.
 * @param {string} params.category - The category.
 * @param {string} params.categoryId - The ID of the category.
 * @param {string} params.sortBy - The field to sort by.
 * @param {string} params.sortDirection - The direction to sort in. Defaults to 'asc'.
 * @param {boolean} params.published - Whether to only include published assets. Defaults to true.
 * @param {boolean} params.indexable - Whether to only include indexable assets. Defaults to true.
 * @param {boolean} params.preferCurrent - Whether to prefer current assets.
 * @param {boolean} params.showPublic - Whether to include public assets.
 * @param {Array} params.roles - An array of roles.
 * @param {boolean} params.searchInProvider - Whether to search in the provider.
 * @param {Object} params.providerQuery - The query to use when searching in the provider.
 * @param {Array} params.programs - An array of programs.
 * @param {Array} params.subjects - An array of subjects.
 * @param {MoleculerContext} params.ctx - The context object containing transaction details.
 * @param {Array} params.assets - An array of assetIds to filter by.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of assets.
 * @throws {LeemonsError} - Throws an error if the retrieval of permissions by category fails.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function getByCategory({
  category,
  categoryId: _categoryId,
  sortBy: sortingBy,
  sortDirection = 'asc',
  published = true,
  indexable = true,
  preferCurrent,
  showPublic,
  roles,
  searchInProvider,
  providerQuery: _providerQuery,
  programs: _programs,
  subjects: _subjects,
  ctx,
  assets = [], // AssetIds
}) {
  try {
    const { userSession } = ctx.meta;
    const [programs, subjects, providerQuery] = handleParams({
      programs: _programs,
      subjects: _subjects,
      providerQuery: _providerQuery,
    });

    const categoryId = _categoryId ?? (await getCategoryId({ category, ctx }));

    const [permissions, viewItems, editItems, assignItems] = await handlePermissions({
      userSession,
      categoryId,
      ctx,
    });

    let assetIds = assets ?? [];
    let publicAssets = [];

    // If no assetIds, we get the public assets as start point
    if (!assetIds.length) {
      publicAssets = showPublic ? await getPublic({ categoryId, indexable, ctx }) : [];
      assetIds = await handleAssetIds({
        permissions,
        publicAssets,
        viewItems,
        editItems,
        assignItems,
        categoryId,
        published,
        preferCurrent,
        ctx,
      });
    }

    // ES: Buscamos en el provider si se ha indicado
    // EN: Search in the provider if indicated so
    if (searchInProvider) {
      try {
        assetIds = await getByProvider({
          categoryId,
          criteria: '',
          query: providerQuery,
          assets: assetIds,
          published,
          preferCurrent,
          ctx,
        });
      } catch (e) {
        ctx.logger.error(`Failed to get assets from provider: ${e.message}`);
      }
    }

    if (isBoolean(indexable)) {
      assetIds = (
        await ctx.tx.db.Assets.find({ id: assetIds, indexable }).select(['id']).lean()
      ).map((item) => item.id);
    }

    if (programs) {
      assetIds = await getAssetsByProgram({ program: programs, assets: assetIds, ctx });
    }

    if (subjects) {
      assetIds = await getAssetsBySubject({ subject: subjects, assets: assetIds, ctx });
    }

    if (published !== undefined && preferCurrent) {
      assetIds = await filterByPublishStatus({
        assets: assetIds,
        nothingFound: assetIds.length === 0,
        preferCurrent,
        published,
        ctx,
      });
    }

    // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
    // EN: For the case that you need sorting, we need a different logic
    if (sortingBy && !isEmpty(sortingBy)) {
      return handleSorting({
        assetIds,
        indexable,
        showPublic,
        userSession,
        sortingBy,
        sortDirection,
        ctx,
      });
    }

    let results = handlePermissionsRoles({ permissions, roles, assetIds, ctx });

    if (!roles?.length || roles.includes('viewer')) {
      results = handleViewerRole({ roles, viewItems, results, assetIds, ctx });
    }

    if (!roles?.length || roles.includes('editor')) {
      results = handleEditorRole({ roles, editItems, results, assetIds, ctx });
    }
    if (!roles?.length || roles.includes('assigner')) {
      results = handleAssignerRole({ roles, assignItems, results, assetIds, ctx });
    }

    if (indexable === true) {
      results = await handleIndexable({ results, ctx });
    }

    results = uniqBy(
      results.concat(publicAssets.filter(({ asset }) => assetIds.includes(asset))),
      'asset'
    );

    if (preferCurrent) {
      results = await handlePreferCurrent({ results, ctx });
    }

    return uniqBy(results, 'asset');
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByCategory };
