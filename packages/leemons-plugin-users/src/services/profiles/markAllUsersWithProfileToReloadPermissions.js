const _ = require('lodash');
const { table } = require('../tables');

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} profileId - Profile id
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function markAllUsersWithProfileToReloadPermissions(
  profileId,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const profileRoles = await table.profileRole.find(
        { profile: profileId },
        {
          columns: ['role'],
          transacting,
        }
      );
      return await table.userAgent.updateMany(
        { role_$in: _.map(profileRoles, 'role') },
        { reloadPermissions: true },
        { transacting }
      );
    },
    table.profiles,
    _transacting
  );
}

module.exports = { markAllUsersWithProfileToReloadPermissions };
