const _ = require('lodash');

/**
 * Return super admin user ids
 * @public
 * @static
 * @return {Promise<string[]>} Super admin ids
 * */
async function getSuperAdminUserIds({ ctx, idKey = 'user' }) {
  const profile = await ctx.tx.db.Profiles.findOne({ uri: 'superadmin' }).select(['role']).lean();

  let userAgents = [];
  if (profile) {
    userAgents = await ctx.tx.db.UserAgent.find({ role: profile.role }).select([idKey]).lean();
  }

  return _.map(userAgents, idKey);
}

module.exports = { getSuperAdminUserIds };
