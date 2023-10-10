/**
 * Add permission to user
 * @async
 * @function addPermissionToUser
 * @param {Object} params - The main parameter object.
 * @param {string} params.id - The id of the assignable.
 * @param {Array<string>} params.userAgents - The user agents to add permission to.
 * @param {string} params.role - The role of the user.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The user agents, role and actions.
 */
const { assignableRolesObject } = require('../../../../../config/constants');
const { getPermissionName } = require('../../helpers/getPermissionName');

async function addPermissionToUser({ id, userAgents, role, ctx }) {
  const { actions } = assignableRolesObject[role];
  await ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
    userAgentId: userAgents,
    data: {
      permissionName: getPermissionName({ id, prefix: true, ctx }),
      actionNames: actions,
    },
  });

  return {
    userAgents,
    role,
    actions,
  };
}

module.exports = { addPermissionToUser };
