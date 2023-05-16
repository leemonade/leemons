const { uniq, difference } = require('lodash');
const permission = require('../../permission');
const getRoleMatchingActions = require('../getRoleMatchingActions');
const getTeacherPermissions = require('./getTeacherPermissions');
const getPermissionName = require('../getPermissionName');

// TODO: Impelement item permissions for teachers

module.exports = async function getUserPermissions(
  assignablesIds,
  { userSession, transacting } = {}
) {
  if (!userSession?.userAgents?.length) {
    return Object.fromEntries(
      assignablesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions([]),
          actions: [],
        },
      ])
    );
  }

  const ids = uniq(assignablesIds);
  const query = { $or: ids.map((id) => ({ permissionName_$contains: getPermissionName(id) })) };

  const permissions = await permission.getUserAgentPermissions(userSession?.userAgents, {
    query,
    transacting,
  });

  const directPermissions = Object.fromEntries(
    permissions.map(({ permissionName, actionNames }) => [
      // plugins.assignables.assignable.* -> length of common part: 31
      // Sometimes PermissionName like: plugins.assignables.assignable.addfcaa9-9ce9-4420-ac40-f12b49107b94@1.0.0.assignableInstance.020f9aca-7486-47ce-a858-c098972b118a
      new RegExp(/\.assignable\.(?<id>[^@]+@(\d+\.){2}\d+)/).exec(permissionName).groups.id,
      actionNames,
    ])
  );

  const assignablesWithoutPermissions = difference(assignablesIds, Object.keys(directPermissions));

  if (!assignablesWithoutPermissions.length) {
    return Object.fromEntries(
      assignablesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions(directPermissions[id] || []),
          actions: directPermissions[id] || [],
        },
      ])
    );
  }

  const teacherPermissions = await getTeacherPermissions(assignablesIds, {
    userSession,
    transacting,
  });

  return Object.fromEntries(
    assignablesIds.map((id) => {
      let actions = [];

      if (directPermissions[id]) {
        actions = directPermissions[id];
      } else if (teacherPermissions[id]) {
        actions = ['edit', 'view', 'assign']; // Teacher actions
      }

      return [
        id,
        {
          role: getRoleMatchingActions(actions),
          actions,
        },
      ];
    })
  );
};
