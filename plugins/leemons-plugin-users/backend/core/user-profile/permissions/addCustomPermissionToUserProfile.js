const _ = require('lodash');
const { exist } = require('../exist');
const { add } = require('../add');
const { getRole } = require('../getRole');
const { validatePermissionName } = require('../../../validations/exists');
const { addPermissionMany, removePermissionsByName } = require('../../roles');
const {
  markAllUserAgentsForUserProfileToReloadPermissions,
} = require('./markAllUserAgentsForUserProfileToReloadPermissions');
const { removeAllItemsCache } = require('../../item-permissions/removeAllItemsCache');

/**
 *
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {RolePermissionsAdd} _permissions - Array of permissions
 * @param {any} _transacting - DB transaction
 * @return {Promise<Permission>} Created permission
 * */
async function addCustomPermissionToUserProfile({ user, profile, permissions: _permissions, ctx }) {
  let permissions = _permissions;
  if (!_.isArray(permissions)) permissions = [permissions];
  _.forEach(permissions, (permission) => {
    validatePermissionName(permission.permissionName, ctx.callerPlugin);
  });
  // Check if already exists, if not create it
  const exists = await exist({ user, profile, ctx });
  if (!exists) await add({ user, profile, ctx });
  const role = await getRole({ user, profile, ctx });
  // ES: Borramos los permisos por si alguno ya existian de antes que se borre ya que se añadira mas adelante
  // EN: We delete the permissions, in case any of them already existed before they will be added later.
  await removePermissionsByName({
    roleId: role,
    permissionNames: _.map(permissions, 'permissionName'),
    removeCustomPermissions: true,
    ctx,
  });

  await Promise.all([
    // ES: Añadimos los permisos
    // EN: Add permissions
    addPermissionMany({ roleId: role, permissions, isCustom: true, ctx }),

    // ES: Actualizamos los usuarios para que recarguen los permisos
    // EN: Update users to reload permissions
    markAllUserAgentsForUserProfileToReloadPermissions({ user, profile, ctx }),
  ]);
  await removeAllItemsCache({ ctx });
  return true;
}

module.exports = { addCustomPermissionToUserProfile };
