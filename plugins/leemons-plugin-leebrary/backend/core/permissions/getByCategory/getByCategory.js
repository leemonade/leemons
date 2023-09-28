/* eslint-disable no-param-reassign */
const { isEmpty, uniqBy } = require('lodash');
const { LeemonsError } = require('@leemons/error');

const { getPublic } = require('../getPublic/getPublic');
const { byProvider: getByProvider } = require('../../search/byProvider');
const { getAssetsByProgram } = require('../../assets/getAssetsByProgram');
const { getAssetsBySubject } = require('../../assets/getAssetsBySubject');

const { handleParams } = require('./handleParams');
const { handlePermissions } = require('./handlePermissions');
const { handleAssetIds } = require('./handleAssetIds');
const { handleSorting } = require('./handleSorting');
const { handlePermissionsRoles } = require('./handlePermissionsRoles');
const { handleViewerRole } = require('./handleViewerRole');
const { handleEditorRole } = require('./handleEditorRole');
const { handleIndexable } = require('./handleIndexable');
const { handlePreferCurrent } = require('./handlePreferCurrent');

/**
 * This function retrieves permissions by category.
 *
 * @param {Object} params - An object containing various parameters.
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
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of assets.
 * @throws {LeemonsError} - Throws an error if the retrieval of permissions by category fails.
 */
async function getByCategory({
  categoryId,
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
}) {
  try {
    const { userSession } = ctx.meta;
    const [programs, subjects, providerQuery] = handleParams({
      programs: _programs,
      subjects: _subjects,
      providerQuery: _providerQuery,
    });

    const [permissions, viewItems, editItems] = await handlePermissions({
      userSession,
      categoryId,
      ctx,
    });

    const publicAssets = showPublic ? await getPublic({ categoryId, indexable, ctx }) : [];
    let assetIds = await handleAssetIds({
      permissions,
      publicAssets,
      viewItems,
      editItems,
      categoryId,
      published,
      preferCurrent,
      ctx,
    });

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

    if (programs) {
      assetIds = await getAssetsByProgram({ program: programs, assets: assetIds, ctx });
    }

    if (subjects) {
      assetIds = await getAssetsBySubject({ subject: subjects, assets: assetIds, ctx });
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
