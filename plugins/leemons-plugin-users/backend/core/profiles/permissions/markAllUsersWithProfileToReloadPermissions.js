const _ = require('lodash');

/**
 * Update the provided role
 * @public
 * @static
 * @param {string} profileId - Profile id
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function markAllUsersWithProfileToReloadPermissions({ profileId, ctx }) {
  const profileRoles = await ctx.tx.db.ProfileRole.find({ profile: profileId })
    .select(['id', 'role'])
    .lean();
  return ctx.tx.db.UserAgent.updateMany(
    { role: _.map(profileRoles, 'role') },
    { reloadPermissions: true }
  );
}

module.exports = { markAllUsersWithProfileToReloadPermissions };
