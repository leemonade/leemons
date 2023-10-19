const { LeemonsError } = require('@leemons/error');

const { buildQuery } = require('./buildQuery');
const { sortAssignables } = require('./sortAssignables');
const { filterByPublished } = require('./filterByPublished');
const { filterByPreferCurrent } = require('./filterByPreferCurrent');
const { getAssignableLastVersion } = require('./getAssignableLastVersion');

const { getUserPermissions } = require('../../permissions/assignables/users/getUserPermissions');

// TODO: Refactor to be able to search deleted assignables
/**
 * Search assignables
 * @async
 * @function searchAssignables
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.roles - The roles of the assignables.
 * @param {Object} params.data - The data to search.
 * @param {boolean} params.data.published - Flag to filter by published status.
 * @param {boolean} params.data.preferCurrent - Flag to filter by preferCurrent status.
 * @param {string} params.data.search - The search string.
 * @param {Array<Object>} params.data.subjects - The subjects to filter by.
 * @param {string} params.data.program - The program to filter by.
 * @param {Object} params.data.sort - The sort object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<string>>} The ids of the assignables that match the search.
 * @throws {LeemonsError} When there's an error searching assignables.
 * @description This function is used to search assignables based on various parameters like roles, published status, preferCurrent status, search string, subjects, program and sort order. It returns the ids of the assignables that match the search criteria. It throws an error if there's any issue in searching the assignables.
 */
async function searchAssignables({
  roles: _roles,
  data: { published, preferCurrent, search, subjects, program, sort, ..._query },
  ctx,
}) {
  try {
    /*
    1. Get all the assignables the userSession has access to
    2. Filter them by latests versions (latest, current, published, draft)
    3. Filter them by the query
    4. Sort them by the sort
  */

    /*
      Filter by:

      ASSET:
        - Nombre ✅
        - Tags ✅
        ASSIGNABLE:
        - Role ✅
        - Gradable ✅
        - Program ✅
        - Subject ✅
        - Methodology ✅

      Sort by:
      - Nombre ✅
      - Dates ❌
    */

    const buildQueryResult = await buildQuery({
      query: _query,
      roles: _roles,
      search,
      sort,
      subjects,
      program,
      ctx,
    });
    if (!buildQueryResult) return [];

    const { query, sorting, assets } = buildQueryResult;

    // EN: Get all the assignables matching the query
    // ES: Obtener todos los asignables que coincidan con la query
    const assignablesData = await ctx.tx.db.Assignables.find(query).select(['id', 'asset']).lean();

    let assignablesIds = sortAssignables(sorting, assignablesData, assets);

    // EN: Filter the assignables based on user permissions
    // ES: Filtrar los asignables según los permisos del usuario
    const permissions = await getUserPermissions({
      assignables: assignablesData,
      ctx,
    });
    assignablesIds = assignablesIds.filter((id) => permissions[id]?.actions?.includes('view'));

    // EN: Filter by published status
    // ES: Filtrar por estado publicado
    assignablesIds = await filterByPublished({
      assignablesIds,
      published,
      ctx,
    });

    // EN: Filter by preferCurrent status
    // ES: Filtrar por estado preferCurrent
    const groupedAssignables = await filterByPreferCurrent({
      assignablesIds,
      published,
      preferCurrent,
      ctx,
    });

    // EN: Get the latest versions of each uuid
    // ES: Obtener la última versión de cada uuid
    assignablesIds = getAssignableLastVersion(groupedAssignables);

    return assignablesIds;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error searching assignables: ${e.message}`,
    });
  }
}

module.exports = {
  searchAssignables,
};
