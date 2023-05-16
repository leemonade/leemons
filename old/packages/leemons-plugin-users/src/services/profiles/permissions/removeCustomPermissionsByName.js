const _ = require('lodash');
const getProfileRole = require('../getProfileRole');
const { removePermissionsByName } = require('../../roles/permissions/removePermissionsByName');
const { table } = require('../../tables');
const { validatePermissionName } = require('../../../validations/exists');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./markAllUsersWithProfileToReloadPermissions');

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} profileId - Profile id
 * @param {string[] | string} _permissions - Array of permissions
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function removeCustomPermissionsByName(
  profileId,
  _permissions,
  { transacting: _transacting }
) {
  let permissions = _permissions;
  if (!_.isArray(permissions)) permissions = [permissions];
  _.forEach(permissions, (permission) => {
    validatePermissionName(permission, this.calledFrom);
  });
  return global.utils.withTransaction(
    async (transacting) => {
      const role = await getProfileRole(profileId, { transacting });

      await Promise.all([
        removePermissionsByName.call(this, role, permissions, {
          removeCustomPermissions: true,
          transacting,
        }),
        markAllUsersWithProfileToReloadPermissions(profileId, { transacting }),
      ]);

      return true;
    },
    table.profileRole,
    _transacting
  );
}

module.exports = { removeCustomPermissionsByName };
