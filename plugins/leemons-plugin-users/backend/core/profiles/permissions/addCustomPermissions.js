const _ = require('lodash');
const getProfileRole = require('../getProfileRole');
const { validatePermissionName } = require('../../../validations/exists');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./markAllUsersWithProfileToReloadPermissions');
const { addPermissionMany } = require('../../roles');
const {
  removePermissionsByNameAndTarget,
} = require('../../roles/permissions/removePermissionsByNameAndTarget');

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
  await removePermissionsByNameAndTarget({
    roleId: role,
    permissions,
    removeCustomPermissions: true,
    ctx,
  });

  await Promise.all([
    // ES: Añadimos los permisos
    // EN: Add permissions
    addPermissionMany({
      roleId: role,
      permissions,
      isCustom: true,
      ctx,
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
