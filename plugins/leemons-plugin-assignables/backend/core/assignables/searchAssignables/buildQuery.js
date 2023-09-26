const { find, flattenDeep, uniq, intersection } = require('lodash');

const { searchBySubject } = require('../../subjects/searchBySubject');
const { searchByProgram } = require('../../subjects/searchByProgram');
const { listRoles } = require('../../roles/listRoles');
/**
 * Build a query for searching assignables
 * @async
 * @function buildQuery
 * @param {Object} params - The main parameter object.
 * @param {Object} params.query - The query object.
 * @param {Array<string>} params.roles - The roles to filter by.
 * @param {string} params.search - The search string.
 * @param {Object} params.sort - The sort object.
 * @param {Array<Object>} params.subjects - The subjects to filter by.
 * @param {string} params.program - The program to filter by.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<{query: Object, sorting: Object, assets: Array<string>}>} The query, sorting and assets for the search.
 */
async function buildQuery({ query: _query, roles: _roles, search, sort, subjects, program, ctx }) {
  const query = {
    ..._query,
  };

  let roles;
  if (_roles) {
    roles = Array.isArray(_roles) ? _roles : [_roles];
    query.role = roles;
  } else {
    roles = await listRoles({ ctx });
  }

  let assets;
  let sorting;

  if (sort) {
    sorting = sort.split(',').map((s) => {
      const [key, direction] = s.trim().split(':');

      return {
        key,
        direction: direction || 'asc',
      };
    });

    const nameSort = find(sorting, { key: 'name' });

    if (nameSort) {
      let assetsFound = await Promise.all(
        roles.map((role) =>
          ctx.tx.call('leebrary.search.search', {
            criteria: search,
            category: `assignables.${role}`,
            allVersions: true,
            published: 'all',
            sortBy: ['name'],
            sortDirection: nameSort.direction,
            ctx,
          })
        )
      );

      assetsFound = flattenDeep(assetsFound);

      assets = uniq(assetsFound.map(({ asset }) => asset));
    }
  }

  if (search) {
    if (!assets?.length) {
      let assetsFound = await Promise.all(
        roles.map((role) =>
          ctx.tx.call('leebrary.search.search', {
            criteria: search,
            category: `assignables.${role}`,
            allVersions: true,
            published: 'all',
            showPublic: true,
            ctx,
          })
        )
      );

      assetsFound = flattenDeep(assetsFound);
      //! no tenía antes el uniq lo pongo para que sea igual que la linea :65
      // assets = assetsFound.map(({ asset }) => asset);
      assets = uniq(assetsFound.map(({ asset }) => asset));

      if (!assets.length) {
        return null;
      }
    }
    query.asset = assets;
  }

  if (subjects) {
    query.id = await searchBySubject({ id: subjects, ctx });
  }

  if (program) {
    const ids = await searchByProgram({ id: program, ctx });
    query.id = Array.isArray(query.id) ? intersection(query.id, ids) : ids;
  }

  return { query, sorting, assets };
}

module.exports = { buildQuery };
