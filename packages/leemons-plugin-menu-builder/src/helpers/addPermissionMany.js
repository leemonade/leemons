const _ = require('lodash');
const { table } = require('../tables');

async function _addPermissionMany(
  targetName,
  targetId,
  targetTable,
  tablePermission,
  permissions,
  { transacting }
) {
  const targetExist = await targetTable.count({ id: targetId }, { transacting });
  if (!targetExist) throw new Error(`The ${targetName} with the specified ID does not exist`);
  const items = [];
  _.forEach(permissions, (permission) => {
    _.forEach(permission.actionNames, (actionName) => {
      const newItem = {
        permissionName: permission.permissionName,
        actionName,
        target: permission.target,
      };
      newItem[targetName] = targetId;
      items.push(newItem);
    });
  });

  return tablePermission.createMany(items, { transacting });
}

/**
 * Update the provided Menu
 * @public
 * @static
 * @param {string} menuId - Menu ID
 * @param {MenuPermissionsAdd} permissions - Array of permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created menu-permissions
 * */
async function addMenuPermissionMany(menuId, permissions, { transacting }) {
  const args = ['menu', menuId, table.menu, table.menuPermission, permissions];
  if (transacting)
    return _addPermissionMany(...args, {
      transacting,
    });
  return table.menu.transaction(async (_transacting) =>
    _addPermissionMany(...args, { transacting: _transacting })
  );
}

/**
 * Update the provided MenuItem
 * @public
 * @static
 * @param {string} menuItemId - Menu Item ID
 * @param {MenuPermissionsAdd} permissions - Array of permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created menu-permissions
 * */
async function addMenuItemPermissionMany(menuItemId, permissions, { transacting }) {
  const args = ['menuItem', menuItemId, table.menuItem, table.menuItemPermission, permissions];
  if (transacting)
    return _addPermissionMany(...args, {
      transacting,
    });
  return table.menu.transaction(async (_transacting) =>
    _addPermissionMany(...args, { transacting: _transacting })
  );
}

module.exports = { addMenuPermissionMany, addMenuItemPermissionMany };
