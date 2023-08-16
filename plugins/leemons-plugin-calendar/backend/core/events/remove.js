const { getPermissionConfig } = require('./getPermissionConfig');

/**
 *
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} _transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove({ id, ctx }) {
  const permissionConfig = getPermissionConfig(id);
  const permissionQuery = {
    permissionName: permissionConfig.permissionName,
  };

  await Promise.all([
    // ES: Borramos a todos los agentes el permiso del evento ya que este dejara de existir
    await ctx.tx.call('users.permissions.removeCustomPermissionForAllUserAgents', {
      data: permissionQuery,
    }),
    // ES: Borramos el elemento de la tabla items de permisos ya que dejara de existir

    await ctx.tx.call('users.permissions.removeItems', {
      query: { type: permissionConfig.type, item: id },
    }),
  ]);

  await ctx.tx.db.EventCalendar.deleteMany({ event: id });

  return ctx.tx.db.Events.deleteOne({ id });
}

module.exports = { remove };
