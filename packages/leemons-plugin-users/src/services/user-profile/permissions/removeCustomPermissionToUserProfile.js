const _ = require('lodash');
const { table } = require('../../tables');
const { exist } = require('../exist');
const { getRole } = require('../getRole');
const { validatePermissionName } = require('../../../validations/exists');
const { removePermissionsByName } = require('../../roles');
const {
  markAllUserAgentsForUserProfileToReloadPermissions,
} = require('./markAllUserAgentsForUserProfileToReloadPermissions');

/**
 *
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {string[] | string} _permissions - Array of permissions
 * @param {any} _transacting - DB transaction
 * @return {Promise<Permission>} Created permission
 * */
async function removeCustomPermissionToUserProfile(
  user,
  profile,
  _permissions,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      let permissions = _permissions;
      if (!_.isArray(permissions)) permissions = [permissions];
      _.forEach(permissions, (permission) => {
        validatePermissionName(permission, this.calledFrom);
      });

      const exists = await exist(user, profile, { transacting });
      if (!exists) return true;

      const role = await getRole(user, profile, { transacting });

      await Promise.all([
        removePermissionsByName.call(this, role, permissions, {
          removeCustomPermissions: true,
          transacting,
        }),
        markAllUserAgentsForUserProfileToReloadPermissions(user, profile, { transacting }),
      ]);

      return true;
    },
    table.userProfile,
    _transacting
  );
}

module.exports = { removeCustomPermissionToUserProfile };
