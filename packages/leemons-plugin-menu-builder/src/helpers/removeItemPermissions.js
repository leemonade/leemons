/**
 * ES:
 * Borra de la tabla permiso de items los registros
 *
 * EN:
 * Remove from the item permission table the records
 *
 * @public
 * @static
 * @param {string} key - Menu/Menu item key
 * @param {'menu' | 'menu-item'} type - Type of register
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created menu-permissions
 * */
async function removeItemPermissions(key, type, { transacting } = {}) {
  await leemons.plugins.users.services.itemPermissions.remove(
    {
      type: leemons.plugin.prefixPN(type),
      item: key,
    },
    { transacting }
  );
}

module.exports = removeItemPermissions;
