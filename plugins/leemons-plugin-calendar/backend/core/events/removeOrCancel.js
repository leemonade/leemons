const { getPermissionConfig } = require('./getPermissionConfig');
const { remove } = require('./remove');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeOrCancel({ id, forceDelete, ctx }) {
  const permissionConfig = getPermissionConfig(id);
  const permissionQuery = {
    permissionName: permissionConfig.permissionName,
  };
  // ES: Buscamos que agentes tienen permiso al evento
  const userAgentIds = await ctx.tx.call('users.permissions.findUserAgentsWithPermission', {
    permissions: permissionQuery,
  });

  // ES: Si hay mas de un invitado (Owner + otros) cancelamos el evento
  if (userAgentIds.length > 1 && !forceDelete) {
    return ctx.tx.db.Events.findOneAndUpdate(
      { id },
      { status: 'cancel' },
      { new: true, lean: true }
    );
  }

  return remove({ id, ctx });
}

module.exports = { removeOrCancel };
