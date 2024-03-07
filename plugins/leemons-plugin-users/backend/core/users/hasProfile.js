/**
 * Checks if the user has the profile
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>} If have permission return true if not false
 * */
async function hasProfile({ user, profile, ctx }) {
  const results = await ctx.tx.db.UserAgent.countDocuments({ user, profile });
  return !!results;
}

module.exports = hasProfile;
