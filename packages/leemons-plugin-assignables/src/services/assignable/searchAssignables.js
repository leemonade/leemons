const _ = require('lodash');
const semver = require('semver');
const versionControl = require('../versionControl');
const { assignables } = require('../tables');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');

async function asyncFilter(array, f) {
  const results = await Promise.all(array.map(f));

  return array.filter((d, i) => results[i]);
}

module.exports = async function searchAssignables(
  role,
  { published, preferCurrent, ..._query },
  sort,
  { userSession, transacting } = {}
) {
  try {
    /*
    1. Get all the assignables the userSession has access to
    2. Filter them by latests versions (latest, current, published, draft)
    3. Filter them by the query
    4. Sort them by the sort
  */

    const query = {
      role,
    };

    // EN: Get all the assignables matching the query
    // ES: Obtener todos los asignables que coincidan con la query
    let assignablesIds = (await assignables.find(query, { columns: ['id'], transacting })).map(
      (assignable) => assignable.id
    );

    // EN: Filter the assignables based on user permissions
    // ES: Filtrar los asignables según los permisos del usuario
    assignablesIds = await asyncFilter(assignablesIds, async (id) => {
      const permissions = await getUserPermission({ id }, { userSession, transacting });
      return permissions.actions.includes('view');
    });

    // EN: Filter by published status
    // ES: Filtrar por estado publicado
    assignablesIds = await Promise.all(
      assignablesIds.map((id) => versionControl.getVersion(id, { transacting }))
    );
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
