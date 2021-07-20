const _ = require('lodash');

/**
 * ES:
 * Añade a la tabla permiso de items los registros
 *
 * EN:
 * Adds to the item permission table the records
 *
 * @public
 * @static
 * @param {string} key - Menu/Menu item key
 * @param {'menu' | 'menu-item'} type - Type of register
 * @param {MenuPermissionsAdd} permissions - Array of permissions
 * @param {boolean=} isCustomPermission - If it is a custom permit, it is not checked if it exists in the list of permits.
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created menu-permissions
 * */
async function addItemPermissions(
  key,
  type,
  permissions,
  { isCustomPermission, transacting } = {}
) {
  const itemPermissions = _.map(permissions, (permission) => ({
    ...permission,
    type: leemons.plugin.prefixPN(type),
    item: key,
  }));
  await leemons.plugins.users.services.itemPermissions.addMany(itemPermissions, {
    isCustomPermission,
    transacting,
  });
}

module.exports = addItemPermissions;
