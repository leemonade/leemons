const { escapeRegExp } = require('lodash');

const { getPermissionName } = require('../../helpers/getPermissionName');
const { getRoleMatchingActions } = require('../../helpers/getRoleMatchingActions');
const { getTeacherPermission } = require('../getTeacherPermission');

/**
 * Retrieves the user permissions based on the assignable ID and context.
 *
 * @param {Object} options - The options for retrieving the user permissions.
 * @param {string} options.assignableId - The ID of the assignable.
 * @param {MoleculerContext} options.ctx - The Moleculer context.
 * @return {Promise<Object>} A promise that resolves to an object containing the user's role and actions.
 */
async function getUserPermission({ assignableId, ctx }) {
  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: { $regex: escapeRegExp(getPermissionName({ id: assignableId, ctx })) },
    },
  });

  if (!permissions.length) {
    const teacherPermissions = await getTeacherPermission({ assignableId, ctx });

    permissions.push(...teacherPermissions);
  }

  if (!permissions.length) {
    // TODO: Return no permissions (for the demo everything is public)
    return {
      role: 'viewer',
      actions: ['view'],
    };
  }

  const userActions = permissions[0].actionNames;

  return {
    role: getRoleMatchingActions({ actions: userActions }),
    actions: userActions,
  };
}

module.exports = { getUserPermission };
