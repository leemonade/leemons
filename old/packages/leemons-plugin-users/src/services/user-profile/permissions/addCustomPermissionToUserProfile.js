const _ = require('lodash');
const { table } = require('../../tables');
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
async function addCustomPermissionToUserProfile(
  user,
  profile,
  _permissions,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // Validate permissions
      let permissions = _permissions;
      if (!_.isArray(permissions)) permissions = [permissions];
      _.forEach(permissions, (permission) => {
        validatePermissionName(permission.permissionName, this.calledFrom);
      });
      // Check if already exists, if not create it
      const exists = await exist(user, profile, { transacting });
      if (!exists) await add(user, profile, { transacting });
      const role = await getRole(user, profile, { transacting });
      // ES: Borramos los permisos por si alguno ya existian de antes que se borre ya que se añadira mas adelante
      // EN: We delete the permissions, in case any of them already existed before they will be added later.
      await removePermissionsByName.call(this, role, _.map(permissions, 'permissionName'), {
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
        markAllUserAgentsForUserProfileToReloadPermissions(user, profile, { transacting }),
      ]);
      await removeAllItemsCache();
      return true;
    },
    table.userProfile,
    _transacting
  );
}

module.exports = { addCustomPermissionToUserProfile };
