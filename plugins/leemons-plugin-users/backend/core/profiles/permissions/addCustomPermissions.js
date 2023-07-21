const _ = require('lodash');
const getProfileRole = require('../getProfileRole');
const { validatePermissionName } = require('../../../validations/exists');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./markAllUsersWithProfileToReloadPermissions');

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} profileId - Profile id
 * @param {RolePermissionsAdd} _permissions - Array of permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function addCustomPermissions({ profileId, permissions: _permissions, ctx }) {
  let permissions = _permissions;
  if (!_.isArray(permissions)) permissions = [permissions];
  _.forEach(permissions, (permission) => {
    validatePermissionName(permission.permissionName, ctx.callerPlugin);
  });
  const role = await getProfileRole({ profileId, ctx });
  // ES: Borramos los permisos por si alguno ya existian de antes que se borre ya que se añadira mas adelante
  // EN: We delete the permissions, in case any of them already existed before they will be added later.
  await ctx.tx.call('users.permissions.removePermissionsByNameAndTarget', {
    roleId: role,
    permissions,
    removeCustomPermissions: true,
  });

  await Promise.all([
    // ES: Añadimos los permisos
    // EN: Add permissions
    ctx.tx.call('users.roles.addPermissionMany', {
      roleId: role,
      permissions,
      isCustom: true,
    }),

    // ES: Actualizamos los usuarios para que recarguen los permisos
    // EN: Update users to reload permissions
    markAllUsersWithProfileToReloadPermissions({
      profileId,
      ctx,
    }),
  ]);

  return true;
}

module.exports = { addCustomPermissions };
