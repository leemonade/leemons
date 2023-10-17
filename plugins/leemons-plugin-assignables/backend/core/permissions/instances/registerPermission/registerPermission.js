const { LeemonsError } = require('@leemons/error');

const { getPermissionName } = require('../helpers/getPermissionName');
const { getPermissionType } = require('../helpers/getPermissionType');

const { assignableInstanceActions } = require('../../../../config/constants');

async function registerPermission({ assignableInstance, assignable, ctx }) {
  try {
    return await ctx.tx.call('users.permissions.addItem', {
      item: assignableInstance,
      type: getPermissionType({ ctx }),
      data: {
        permissionName: getPermissionName({
          assignableInstance,
          assignable,
          prefix: true,
          ctx,
        }),
        actionNames: assignableInstanceActions,
      },
      isCustomPermission: true,
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error registering permission: ${e.message}`,
    });
  }
}

module.exports = { registerPermission };
