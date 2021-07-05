const _ = require('lodash');
const prefixPN = require('./prefixPN');

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
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created menu-permissions
 * */
async function addItemPermissions(key, type, permissions, { transacting } = {}) {
  const itemPermissions = _.map(permissions, (permission) => ({
    ...permission,
    type: prefixPN(type),
    item: key,
  }));
  await leemons.plugins.users.services.itemPermissions.addMany(itemPermissions, {
    transacting,
  });
}

module.exports = addItemPermissions;
