const { LeemonsError } = require('@leemons/error');
const { getPermissionName } = require('../helpers/getPermissionName');
const { getPermissionType } = require('../helpers/getPermissionType');

async function removePermission({ assignableInstance, assignable, ctx }) {
  try {
    return await ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: getPermissionType({ ctx }),
        permissionName: getPermissionName({
          assignableInstance,
          assignable,
          prefix: true,
          ctx,
        }),
      },
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error removing permission: ${e.message}`,
    });
  }
}

module.exports = { removePermission };
