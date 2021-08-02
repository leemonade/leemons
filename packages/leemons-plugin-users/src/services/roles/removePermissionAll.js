const { table } = require('../tables');

/**
 * Remove all permissions of role
 * @public
 * @static
 * @param {string} roleId - Role id
 * @param {boolean} removeCustomPermissions - If true remove all permission if false only remove no custom permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function removePermissionAll(roleId, { removeCustomPermissions, transacting } = {}) {
  const query = { role: roleId };
  if (!removeCustomPermissions) {
    query.isCustom_$ne = true;
  }
  return table.rolePermission.deleteMany(query, { transacting });
}

module.exports = { removePermissionAll };
