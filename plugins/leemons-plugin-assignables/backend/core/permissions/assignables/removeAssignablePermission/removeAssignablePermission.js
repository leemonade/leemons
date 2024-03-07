const { getPermissionName } = require('../helpers/getPermissionName');
const { getPermissionType } = require('../helpers/getPermissionType');

async function removeAssignablePermission({ id, role, ctx }) {
  if (!id || !role) {
    throw new Error('Cannot remove assignable permission: id and role are required');
  }

  try {
    await ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: getPermissionType({ role, ctx }),
        permissionName: getPermissionName({ id, ctx }),
      },
    });
  } catch (e) {
    throw new Error(`Error removing permission: ${e.message}`);
  }
}
module.exports = { removeAssignablePermission };
