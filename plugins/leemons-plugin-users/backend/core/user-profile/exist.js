/**
 * Return if exist user profile
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any} transacting - DB transaction
 * @return {Promise<boolean>}
 * */
async function exist({ user, profile, ctx }) {
  const count = await ctx.tx.db.UserProfile.countDocuments({ user, profile });
  return !!count;
}

module.exports = { exist };
