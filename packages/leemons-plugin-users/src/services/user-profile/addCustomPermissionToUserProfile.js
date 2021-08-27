const { table } = require('../tables');

/**
 * Create the permit only if the permissionName does not already exist.
 * @public
 * @static
 * @param {PermissionAdd} data - Array of permissions
 * @return {Promise<Permission>} Created permission
 * */
async function addCustomPermissionToUserProfile(data) {
  return table.permissions.transaction(async (transacting) => {});
}

module.exports = { addCustomPermissionToUserProfile };
