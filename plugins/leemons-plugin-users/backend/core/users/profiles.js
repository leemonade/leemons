const _ = require('lodash');

/**
 * Return profiles for active user
 * @public
 * @static
 * @param {string} user - User id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function profiles({ user, ctx }) {
  const userAgents = await ctx.tx.db.UserAgent.find({ user }).select(['role']).lean();

  const profileRoles = await ctx.tx.db.ProfileRole.find({ role: _.map(userAgents, 'role') }).lean();

  return ctx.tx.db.Profiles.find({
    $or: [{ id: _.map(profileRoles, 'profile') }, { role: _.map(userAgents, 'role') }],
  }).lean();
}

module.exports = { profiles };
