const _ = require('lodash');
const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function markAllUserAgentsForUserProfileToReloadPermissions(
  user,
  profile,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const profileRoles = await table.profileRole.find(
        { profile: profile },
        {
          columns: ['role'],
          transacting,
        }
      );
      return await table.userAgent.updateMany(
        { role_$in: _.map(profileRoles, 'role'), user },
        { reloadPermissions: true },
        { transacting }
      );
    },
    table.profiles,
    _transacting
  );
}

module.exports = { markAllUserAgentsForUserProfileToReloadPermissions };
