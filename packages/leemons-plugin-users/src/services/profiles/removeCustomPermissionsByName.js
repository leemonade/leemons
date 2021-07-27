const _ = require('lodash');
const getProfileRoles = require('./getProfileRoles');
const removePermissionsByName = require('../roles/removePermissionsByName');
const { table } = require('../tables');
const { addPermissionMany } = require('../roles');
const { validatePermissionName } = require('../../validations/exists');

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
      const { role } = (await getProfileRoles(profileId, { transacting }))[0];

      await Promise.all([
        removePermissionsByName(role, permissions, {
          removeCustomPermissions: true,
          transacting,
        }),
        table.userAgent.updateMany(
          { profile: profileId },
          { reloadPermissions: true },
          { transacting }
        ),
      ]);

      return true;
    },
    table.profileRole,
    _transacting
  );
}

module.exports = removeCustomPermissionsByName;
