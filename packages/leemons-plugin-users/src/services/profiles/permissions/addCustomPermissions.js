const _ = require('lodash');
const getProfileRole = require('../getProfileRole');
const {
  removePermissionsByNameAndTarget,
} = require('../../roles/permissions/removePermissionsByNameAndTarget');
const { table } = require('../../tables');
const { addPermissionMany } = require('../../roles');
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
async function addCustomPermissions(profileId, _permissions, { transacting: _transacting } = {}) {
  let permissions = _permissions;
  if (!_.isArray(permissions)) permissions = [permissions];
  _.forEach(permissions, (permission) => {
    validatePermissionName(permission.permissionName, this.calledFrom);
  });
  return global.utils.withTransaction(
    async (transacting) => {
      const role = await getProfileRole(profileId, { transacting });
      // ES: Borramos los permisos por si alguno ya existian de antes que se borre ya que se añadira mas adelante
      // EN: We delete the permissions, in case any of them already existed before they will be added later.
      await removePermissionsByNameAndTarget.call(this, role, permissions, {
        removeCustomPermissions: true,
        transacting,
      });

      await Promise.all([
        // ES: Añadimos los permisos
        // EN: Add permissions
        addPermissionMany.call(this, role, permissions, {
          isCustom: true,
          transacting,
        }),

        // ES: Actualizamos los usuarios para que recarguen los permisos
        // EN: Update users to reload permissions
        markAllUsersWithProfileToReloadPermissions(profileId, { transacting }),
      ]);

      return true;
    },
    table.profileRole,
    _transacting
  );
}

module.exports = { addCustomPermissions };
