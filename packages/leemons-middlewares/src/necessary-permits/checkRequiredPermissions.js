const { LeemonsError } = require('@leemons/error');
const { forIn } = require('lodash');

module.exports = async function checkRequiredPermissions({ allowedPermissions, ctx }) {
  if (ctx.meta.userSession) {
    const hasPermission = await ctx.tx.call('users.auth.hasPermissionCTX', {
      allowedPermissions,
    });

    if (hasPermission) {
      return true;
    }
  }

  const rAllowedPermissions = [];
  forIn(allowedPermissions, ({ actions }, permissionName) => {
    rAllowedPermissions.push({ permissionName, actions });
  });
  throw new LeemonsError(ctx, {
    httpStatusCode: 401,
    message: 'You do not have permissions',
    allowedPermissions: rAllowedPermissions,
  });
};
