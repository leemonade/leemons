const _ = require('lodash');
const { table } = require('../../tables');

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
  { transacting } = {}
) {
  const profileRoles = await table.profileRole.find(
    { profile },
    {
      columns: ['id', 'role'],
      transacting,
    }
  );
  return table.userAgent.updateMany(
    { role_$in: _.map(profileRoles, 'role'), user },
    { reloadPermissions: true },
    { transacting }
  );
}

module.exports = { markAllUserAgentsForUserProfileToReloadPermissions };
