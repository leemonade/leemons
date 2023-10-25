const { getPermissionName } = require('../../../instances/helpers/getPermissionName');
const { getRoleMatchingActions } = require('../../../instances/helpers/getRoleMatchingActions');
const { getTeacherPermission } = require('../getTeacherPermission');

/**
 * Retrieves the user's permission based on the assignable instance and the context.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.assignableInstance - The assignable instance.
 * @param {MoleculerContext} params.ctx - The Moleculer context.e user's session object.
 * @return {Promise<Object>} The user's permission object.
 */
async function getUserPermission({ assignableInstance, ctx }) {
  const { userSession } = ctx.meta;

  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: userSession.userAgents,
    query: { permissionName: getPermissionName({ assignableInstance, ctx }) },
  });

  if (!permissions.length) {
    permissions.push(...(await getTeacherPermission({ assignableInstance, ctx })));
  }

  if (!permissions.length) {
    // TODO: Return no permissions (for the demo everything is public)
    return {
      role: 'viewer',
      actions: ['view'],
    };
    // return {
    //   role: null,
    //   actions: [],
    // };
  }

  return {
    role: getRoleMatchingActions({ actions: permissions[0].actionNames }),
    actions: permissions[0].actionNames,
  };
}

module.exports = { getUserPermission };
