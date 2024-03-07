const _ = require('lodash');

async function getRolesProfiles({ roleIds, raw, ctx }) {
  const profilesRoles = await ctx.tx.db.ProfileRole.find({ role: roleIds })
    .select(['id', 'profile', 'role'])
    .lean();
  if (raw) return profilesRoles;
  return _.map(profilesRoles, 'profile');
}

module.exports = { getRolesProfiles };
