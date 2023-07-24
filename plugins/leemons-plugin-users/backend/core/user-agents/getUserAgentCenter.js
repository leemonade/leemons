const _ = require('lodash');

/**
 * Return the user agent/s center/s
 * @public
 * @static
 * @param {UserAgent|UserAgent[]} userAgent - Id or ids of user agents
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function getUserAgentCenter({ userAgent, ctx }) {
  const isArray = _.isArray(userAgent);
  const userAgents = isArray ? userAgent : [userAgent];
  const roleCenters = await ctx.tx.db.RoleCenter.find({ role: _.map(userAgents, 'role') })
    .select(['center'])
    .lean();
  const centers = await ctx.tx.db.Centers.find({ id: _.map(roleCenters, 'center') }).lean();
  return isArray ? centers : centers[0];
}

module.exports = { getUserAgentCenter };
