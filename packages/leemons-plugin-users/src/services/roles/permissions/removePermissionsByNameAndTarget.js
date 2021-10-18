const _ = require('lodash');
const { table } = require('../../tables');
const { validatePermissionName } = require('../../../validations/exists');
const {
  searchUsersWithRoleAndMarkAsReloadPermissions,
} = require('../searchUsersWithRoleAndMarkAsReloadPermissions');

/**
 * Remove all permissions of role
 * @public
 * @static
 * @param {string} roleId - Role id
 * @param {string[]} permissionNames - Permission names
 * @param {boolean} removeCustomPermissions - If true remove all permission if false only remove no custom permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function removePermissionsByNameAndTarget(
  roleId,
  permissions,
  { removeCustomPermissions, transacting } = {}
) {
  _.forEach(permissions, ({ permissionName }) => {
    validatePermissionName(permissionName, this.calledFrom);
  });
  const query = {
    role: roleId,
    $or: permissions.map(({ permissionName, target = null }) => ({
      permissionName,
      target,
    })),
  };
  if (!removeCustomPermissions) {
    query.isCustom_$ne = true;
  }
  await searchUsersWithRoleAndMarkAsReloadPermissions(roleId, { transacting });
  return table.rolePermission.deleteMany(query, { transacting });
}

module.exports = { removePermissionsByNameAndTarget };
