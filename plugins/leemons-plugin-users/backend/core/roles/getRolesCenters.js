const _ = require('lodash');

async function getRolesCenters({ roleIds, raw, ctx }) {
  const centerRoles = await ctx.tx.db.RoleCenter.find({ role: roleIds })
    .select(['id', 'center', 'role'])
    .lean();
  if (raw) return centerRoles;
  return _.map(centerRoles, 'center');
}

module.exports = { getRolesCenters };
