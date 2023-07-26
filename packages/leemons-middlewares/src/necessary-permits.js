const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

module.exports =
  ({ allowedPermissions }) =>
  async (ctx) => {
    // TODO: Ahora mismo con que cualquiera de los user auth tenga permiso pasa al controlador, aqui entra la duda de si se le deberian de pasar todos los user auth o solo los que tengan permiso, por qe es posible que relacione algun dato a un user auth que realmente no deberia de tener acceso
    // TODO QUITAR LOS USER AUTH QUE NO TENGAN EL PERMISO
    if (!ctx.meta.userSession) {
      throw new LeemonsError(ctx, {
        httpStatusCode: 401,
        message:
          'No user session found for check permissions, check if endpoint have [authenticated: true] property',
      });
    }
    const hasPermission = await ctx.tx.call('users.auth.hasPermissionCTX', {
      userSession: ctx.meta.userSession,
      allowedPermissions,
    });

    if (hasPermission) {
      return;
    }
    const rAllowedPermissions = [];
    _.forIn(allowedPermissions, ({ actions }, permissionName) => {
      rAllowedPermissions.push({ permissionName, actions });
    });
    throw new LeemonsError(ctx, {
      httpStatusCode: 401,
      message: 'You do not have permissions',
      allowedPermissions: rAllowedPermissions,
    });
  };
