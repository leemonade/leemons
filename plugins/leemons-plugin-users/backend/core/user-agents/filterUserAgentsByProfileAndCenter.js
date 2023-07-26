const _ = require('lodash');

async function filterUserAgentsByProfileAndCenter({ userAgentIds, profile, center, ctx }) {
  // eslint-disable-next-line no-nested-ternary
  const profiles = profile ? (_.isArray(profile) ? profile : [profile]) : [];
  // eslint-disable-next-line no-nested-ternary
  const centers = center ? (_.isArray(center) ? center : [center]) : [];
  const profileQuery = profiles.length ? { profile_$in: profiles } : {};
  const profileRoles = await ctx.tx.db.ProfileRole.find(profileQuery).select(['role']).lean();
  let roleIds = [];
  if (centers.length) {
    const centerRole = await ctx.tx.db.RoleCenter.find({
      center: centers,
      role: _.map(profileRoles, 'role'),
    })
      .select(['role'])
      .lean();
    roleIds = _.map(centerRole, 'role');
  } else {
    roleIds = _.map(profileRoles, 'role');
  }
  const userAgents = await ctx.tx.db.UserAgent.find({
    id: userAgentIds,
    role: roleIds,
  })
    .select(['id'])
    .lean();
  return _.map(userAgents, 'id');
}

module.exports = { filterUserAgentsByProfileAndCenter };
