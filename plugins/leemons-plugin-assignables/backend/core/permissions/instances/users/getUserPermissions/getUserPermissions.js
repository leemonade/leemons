const { uniq, difference, escapeRegExp } = require('lodash');
const { getRoleMatchingActions } = require('../../helpers/getRoleMatchingActions');
const { getTeacherPermissions } = require('../getTeacherPermissions');
const { getPermissionName } = require('../../helpers/getPermissionName');

// TODO: Impelement item permissions for teachers

/**
 * Retrieves the user permissions for a given set of instance IDs.
 *
 * @param {Object} params - The parameters for retrieving user permissions.
 * @param {string[]} params.instancesIds - The IDs of the instances.
 * @param {MoleculerContext} params.ctx - The Moleculer context.e user's session object.
 * @return {Object} An object mapping instance IDs to their corresponding permissions.
 */
async function getUserPermissions({ instancesIds, ctx }) {
  const { userSession } = ctx.meta;

  if (!userSession?.userAgents?.length || !instancesIds?.length) {
    return Object.fromEntries(
      instancesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions({ actions: [] }),
          actions: [],
        },
      ])
    );
  }

  const ids = uniq(instancesIds);
  const query = {
    $or: ids.map((id) => ({
      permissionName: {
        $regex: escapeRegExp(getPermissionName({ assignableInstance: id, ctx })),
        $options: 'i',
      },
    })),
  };

  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userSession?.userAgents,
    query,
  });

  const directPermissions = Object.fromEntries(
    permissions.map(({ permissionName, actionNames }) => [
      // PermissionName like: assignables.assignable.addfcaa9-9ce9-4420-ac40-f12b49107b94@1.0.0.assignableInstance.020f9aca-7486-47ce-a858-c098972b118a
      /\.assignableInstance\.(?<id>[^.]+)/.exec(permissionName).groups.id,
      actionNames,
    ])
  );

  const instancesWithoutPermissions = difference(instancesIds, Object.keys(directPermissions));

  if (!instancesWithoutPermissions.length) {
    return Object.fromEntries(
      instancesIds.map((id) => [
        id,
        {
          role: getRoleMatchingActions({ actions: directPermissions[id] || [] }),
          actions: directPermissions[id] || [],
        },
      ])
    );
  }

  const teacherPermissions = await getTeacherPermissions({ instances: instancesIds, ctx });

  return Object.fromEntries(
    instancesIds.map((id) => {
      let actions = [];

      if (directPermissions[id]) {
        actions = directPermissions[id];
      } else if (teacherPermissions[id]) {
        actions = ['edit', 'view']; // Teacher actions
      }

      return [
        id,
        {
          role: getRoleMatchingActions({ actions }),
          actions,
        },
      ];
    })
  );
}

module.exports = { getUserPermissions };
