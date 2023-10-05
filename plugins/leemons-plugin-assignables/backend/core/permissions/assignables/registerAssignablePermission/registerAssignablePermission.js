const { getPermissionType } = require('../helpers/getPermissionType');
const { getPermissionName } = require('../helpers/getPermissionName');
const { assignableActions } = require('../../../../config/constants');

async function registerAssignablePermission({ id, role, ctx }) {
  try {
    if (!id || !role) {
      throw new Error('The id and role params are required');
    }
    return await ctx.tx.call('users.permissions.addItem', {
      item: id,
      type: getPermissionType({ role, ctx }),
      data: {
        permissionName: getPermissionName({ id, prefix: true, ctx }),
        actionNames: assignableActions,
      },
      isCustomPermission: true,
    });
  } catch (e) {
    e.message = `Error registering permission: ${e.message}`;
    throw e;
  }
}

module.exports = { registerAssignablePermission };
