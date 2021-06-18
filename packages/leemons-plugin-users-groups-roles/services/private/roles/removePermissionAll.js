const { table } = require('../tables');

async function _removePermissionAll(role, transacting) {
  return table.rolePermission.deleteMany({ role }, { transacting });
}

/**
 * Remove all permissions of role
 * @public
 * @static
 * @param {string} roleId - Role id
 * @param {any} transacting - DB Transaction
 * @return {Promise<Role>} Created / Updated role
 * */
async function removePermissionAll(roleId, transacting) {
  if (transacting) return _removePermissionAll(roleId, transacting);
  return table.roles.transaction(async (transactin) => _removePermissionAll(roleId, transactin));
}

module.exports = { removePermissionAll };
