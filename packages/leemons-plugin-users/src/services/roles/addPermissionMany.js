const _ = require('lodash');
const { table } = require('../tables');

async function _addPermissionMany(roleId, permissions, { transacting }) {
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
      });
    });
  });

  return table.rolePermission.createMany(items, { transacting });
}

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} roleId - Role id
 * @param {RolePermissionsAdd} permissions - Array of permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function addPermissionMany(roleId, permissions, { transacting }) {
  if (transacting) return _addPermissionMany(roleId, permissions, { transacting });
  return table.roles.transaction(async (_transacting) =>
    _addPermissionMany(roleId, permissions, { transacting: _transacting })
  );
}

module.exports = { addPermissionMany };
