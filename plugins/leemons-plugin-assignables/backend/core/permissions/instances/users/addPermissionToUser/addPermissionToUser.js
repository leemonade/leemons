const constants = require('../../../../../config/constants');
const { getPermissionName } = require('../../../instances/helpers/getPermissionName');

/**
 * Add a permission to a user.
 *
 * @param {Object} options - The options for adding the permission.
 * @param {Object} options.assignableInstance - The assignable instance.
 * @param {Object} options.assignable - The assignable.
 * @param {Array} options.userAgents - The user agents.
 * @param {string} options.role - The role.
 * @param {MoleculerContext} options.ctx - The Moleculer context.
 * @return {Object} - The added permission details.
 */
async function addPermissionToUser({ assignableInstance, assignable, userAgents, role, ctx }) {
  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgentId: userAgents,
    throwIfExists: false,
    data: {
      permissionName: getPermissionName({ assignableInstance, assignable, prefix: true, ctx }),
      actionNames: constants.assignableInstanceRolesObject[role].actions,
    },
  });

  return {
    userAgents,
    role,
    actions: constants.assignableInstanceRolesObject[role].actions,
  };
}

module.exports = { addPermissionToUser };
