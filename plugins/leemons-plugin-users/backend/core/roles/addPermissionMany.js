const _ = require('lodash');
const {
  searchUsersWithRoleAndMarkAsReloadPermissions,
} = require('./searchUsersWithRoleAndMarkAsReloadPermissions');
const { validatePermissionName } = require('../../validations/exists');

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
async function addPermissionMany({ roleId, permissions, isCustom, ctx }) {
  if (ctx.callerPlugin !== 'users') {
    _.forEach(permissions, (permission) => {
      validatePermissionName(permission.permissionName, ctx.callerPlugin);
    });
  }
  const roleExist = await ctx.tx.db.Roles.countDocuments({ id: roleId });
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

  await searchUsersWithRoleAndMarkAsReloadPermissions({ roleId, ctx });

  return ctx.tx.db.RolePermission.insertMany(items);
}

module.exports = { addPermissionMany };
