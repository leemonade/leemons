const _ = require('lodash');
const { table } = require('../../tables');

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} profileId - Profile id
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function markAllUsersWithProfileToReloadPermissions(profileId, { transacting } = {}) {
  const profileRoles = await table.profileRole.find(
    { profile: profileId },
    {
      columns: ['id', 'role'],
      transacting,
    }
  );
  return table.userAgent.updateMany(
    { role_$in: _.map(profileRoles, 'role') },
    { reloadPermissions: true },
    { transacting }
  );
}

module.exports = { markAllUsersWithProfileToReloadPermissions };
