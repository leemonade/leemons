const _ = require('lodash');
const semver = require('semver');
const versionControl = require('../versionControl');
const { assignables } = require('../tables');
const leebrary = require('../leebrary/leebrary');
const searchBySubject = require('../subjects/searchBySubject');
const searchByProgram = require('../subjects/searchByProgram');
const listRoles = require('../roles/listRoles');
const getUserPermissions = require('./permissions/assignable/users/getUserPermissions');

// TODO: Refactor to be able to search deleted assignables

module.exports = async function searchAssignables(
  _roles,
  { published, preferCurrent, search, subjects, program, sort, ..._query },
  { userSession, transacting } = {}
) {
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

    const query = {
      ..._query,
    };

    let roles;
    if (_roles) {
      roles = Array.isArray(_roles) ? _roles : [_roles];
      query.role_$in = roles;
    } else {
      roles = await listRoles({ transacting });
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

      const nameSort = _.find(sorting, { key: 'name' });

      if (nameSort) {
        let assetsFound = await Promise.all(
          roles.map((role) =>
            leebrary().search.search(
              { category: `assignables.${role}`, criteria: search },
              {
                allVersions: true,
                published: 'all',
                sortBy: ['name'],
                sortDirection: nameSort.direction,
                transacting,
                userSession,
              }
            )
          )
        );

        assetsFound = _.flattenDeep(assetsFound);

        assets = _.uniq(assetsFound.map(({ asset }) => asset));
      }
    }

    if (search) {
      if (!assets?.length) {
        let assetsFound = await Promise.all(
          roles.map((role) =>
            leebrary().search.search(
              { criteria: search, category: `assignables.${role}` },
              { allVersions: true, published: 'all', showPublic: true, transacting, userSession }
            )
          )
        );

        assetsFound = _.flattenDeep(assetsFound);
        assets = assetsFound.map(({ asset }) => asset);

        if (!assets.length) {
          return [];
        }
      }
      query.asset_$in = assets;
    }

    if (subjects) {
      query.id_$in = await searchBySubject(subjects, { transacting });
    }

    if (program) {
      const ids = await searchByProgram(program, { transacting });

      query.id_$in = Array.isArray(query.id_$in) ? _.intersection(query.id_$in, ids) : ids;
    }

    // EN: Get all the assignables matching the query
    // ES: Obtener todos los asignables que coincidan con la query
    const assignablesData = await assignables.find(query, {
      columns: ['id', 'asset'],
      transacting,
    });

    let assignablesIds = assignablesData;
    if (sorting) {
      if (_.find(sorting, { key: 'name' })) {
        assignablesIds = assignablesIds.map((assignable) => {
          const asset = _.findIndex(assets, (a) => a === assignable.asset);

          let position;
          if (asset > -1) {
            position = asset;
          } else {
            position = Math.max();
          }

          return {
            ...assignable,
            position,
          };
        });

        assignablesIds = assignablesIds.sort((a, b) => a.position - b.position);
      }
    }

    assignablesIds = assignablesIds.map(({ id }) => id);

    // EN: Filter the assignables based on user permissions
    // ES: Filtrar los asignables según los permisos del usuario
    const permissions = await getUserPermissions(assignablesData, { userSession, transacting });
    assignablesIds = assignablesIds.filter((id) => permissions[id]?.actions?.includes('view'));

    // EN: Filter by published status
    // ES: Filtrar por estado publicado
    assignablesIds = await versionControl.getVersion(assignablesIds, { transacting });

    if (published !== 'all') {
      assignablesIds = assignablesIds.filter(
        ({ published: isPublished }) => isPublished === published
      );
    }

    // EN: Filter by preferCurrent status
    // ES: Filtrar por estado preferCurrent
    const groupedAssignables = _.groupBy(assignablesIds, (id) => id.uuid);
    if (published !== false && preferCurrent) {
      const assignablesUuids = _.uniq(assignablesIds.map((id) => id.uuid));

      const currentVersions = await Promise.all(
        assignablesUuids.map(async (uuid) => {
          const { current } = await versionControl.getCurrentVersions(uuid, { transacting });

          return { uuid, current: versionControl.stringifyId(uuid, current) };
        })
      );

      // EN: Get only the current versions (if not present, return all)
      // ES: Obtener solo las versiones actuales
      _.forEach(groupedAssignables, (values, uuid) => {
        const currentVersion = _.find(currentVersions, (version) => version.uuid === uuid);

        const current = _.find(values, (id) => id.fullId === currentVersion.current);
        if (current) {
          _.set(groupedAssignables, uuid, [current]);
        }

        return values;
      });
    }

    // EN: Get the latest versions of each uuid
    // ES: Obtener la última versión de cada uuid
    assignablesIds = _.map(groupedAssignables, (values) => {
      const versions = _.map(values, (id) => id.version);

      const latest = semver.maxSatisfying(versions, '*');

      return _.find(values, (id) => id.version === latest).fullId;
    });

    return assignablesIds;
  } catch (e) {
    throw new Error(`Error searching assignables: ${e.message}`);
  }
};
