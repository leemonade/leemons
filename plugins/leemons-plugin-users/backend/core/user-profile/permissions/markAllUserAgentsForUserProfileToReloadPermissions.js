const _ = require('lodash');
/**
 *
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function markAllUserAgentsForUserProfileToReloadPermissions({ user, profile, ctx }) {
  const profileRoles = await ctx.tx.db.ProfileRole.find({ profile }).select(['id', 'role']).lean();
  return ctx.tx.db.UserAgent.updateMany(
    { role: _.map(profileRoles, 'role'), user },
    { reloadPermissions: true }
  );
}

module.exports = { markAllUserAgentsForUserProfileToReloadPermissions };
