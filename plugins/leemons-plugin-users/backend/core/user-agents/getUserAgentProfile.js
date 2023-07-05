const _ = require('lodash');
/**
 * Return the user agent/s center/s
 * @public
 * @static
 * @param {UserAgent|UserAgent[]} userAgent - Id or ids of user agents
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function getUserAgentProfile({ userAgent, ctx }) {
  const isArray = _.isArray(userAgent);
  const userAgents = isArray ? userAgent : [userAgent];
  const roleProfiles = await ctx.tx.db.ProfileRole.find({ role: _.map(userAgents, 'role') })
    .select(['profile'])
    .lean();
  const profiles = await ctx.tx.db.Profiles.find({ id: _.map(roleProfiles, 'profile') }).lean();
  return isArray ? profiles : profiles[0];
}

module.exports = { getUserAgentProfile };
