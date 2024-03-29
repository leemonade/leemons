const {
  searchUsersWithRoleAndMarkAsReloadPermissions,
} = require('../searchUsersWithRoleAndMarkAsReloadPermissions');

/**
 * Remove all permissions of role
 * @public
 * @static
 * @param {string} roleId - Role id
 * @param {boolean} removeCustomPermissions - If true remove all permission if false only remove no custom permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function removePermissionAll({ roleId, removeCustomPermissions, ctx }) {
  const query = { role: roleId };
  if (!removeCustomPermissions) {
    query.isCustom = {
      $ne: true,
    };
  }
  await searchUsersWithRoleAndMarkAsReloadPermissions({ roleId, ctx });
  return ctx.tx.db.RolePermission.deleteMany(query);
}

module.exports = { removePermissionAll };
