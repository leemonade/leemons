const { getPermissionName } = require('../assignables/helpers/getPermissionName');
const { getRoleMatchingActions } = require('../helpers/getRoleMatchingActions');
const { getTeacherPermission } = require('./getTeacherPermission');

async function getUserPermission({ assignableId, ctx }) {
  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: ctx.meta.userSession.userAgents,
    query: { permissionName_$contains: getPermissionName({ id: assignableId, ctx }) },
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
