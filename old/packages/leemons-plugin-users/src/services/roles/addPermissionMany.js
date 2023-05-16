const _ = require('lodash');
const { table } = require('../tables');
const {
  searchUsersWithRoleAndMarkAsReloadPermissions,
} = require('./searchUsersWithRoleAndMarkAsReloadPermissions');

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} roleId - Role id
 * @param {RolePermissionsAdd} permissions - Array of permissions
 *  @param {RolePermissionsAdd} isCustom - Define if the permissions is custom
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function addPermissionMany(roleId, permissions, { isCustom, transacting } = {}) {
  const roleExist = await table.roles.count({ id: roleId }, { transacting });
  if (!roleExist) throw new Error('The role with the specified id does not exist');
  const items = [];
  _.forEach(permissions, (permission) => {
    _.forEach(permission.actionNames, (actionName) => {
      items.push({
        permissionName: permission.permissionName,
        actionName,
        target: permission.target,
        role: roleId,
        isCustom,
      });
    });
  });

  await searchUsersWithRoleAndMarkAsReloadPermissions(roleId, { transacting });

  return table.rolePermission.createMany(items, { transacting });
}

module.exports = { addPermissionMany };
