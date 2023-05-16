const { uniq, difference } = require('lodash');
const permission = require('../../permission');
const getRoleMatchingActions = require('../getRoleMatchingActions');
const getTeacherPermissions = require('./getTeacherPermissions');
const getPermissionName = require('../getPermissionName');

// TODO: Impelement item permissions for teachers

module.exports = async function getUserPermissions(
  instancesIds,
  { userSession, transacting } = {}
) {
  if (!userSession?.userAgents?.length || !instancesIds?.length) {
    return Object.fromEntries(
      instancesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions([]),
          actions: [],
        },
      ])
    );
  }

  const ids = uniq(instancesIds);
  const query = { $or: ids.map((id) => ({ permissionName_$contains: getPermissionName(id) })) };

  const permissions = await permission.getUserAgentPermissions(userSession?.userAgents, {
    query,
    transacting,
  });

  const directPermissions = Object.fromEntries(
    permissions.map(({ permissionName, actionNames }) => [
      // PermissionName like: plugins.assignables.assignable.addfcaa9-9ce9-4420-ac40-f12b49107b94@1.0.0.assignableInstance.020f9aca-7486-47ce-a858-c098972b118a
      new RegExp(/\.assignableInstance\.(?<id>[^.]+)/).exec(permissionName).groups.id,
      actionNames,
    ])
  );

  const instancesWithoutPermissions = difference(instancesIds, Object.keys(directPermissions));

  if (!instancesWithoutPermissions.length) {
    return Object.fromEntries(
      instancesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions(directPermissions[id] || []),
          actions: directPermissions[id] || [],
        },
      ])
    );
  }

  const teacherPermissions = await getTeacherPermissions(instancesIds, {
    userSession,
    transacting,
  });

  return Object.fromEntries(
    instancesIds.map((id) => {
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
