const _ = require('lodash');
const { getRolesCenters } = require('../roles/getRolesCenters');

async function checkIfCanCreateUserAgentInGroup({ userAgentId, groupId, ctx }) {
  const userAgent = await ctx.tx.db.UserAgent.findOne({ id: userAgentId }).select(['role']).lean();
  const [center] = await getRolesCenters({ roleIds: userAgent.role, ctx });

  const limit = await ctx.tx.db.CenterLimits.findOne({
    center,
    item: groupId,
    type: 'role',
  }).lean();

  if (!limit.unlimited && limit.limit) {
    const [roles, userAgents] = await Promise.all([
      ctx.tx.db.RoleCenter.find({ center }).select(['role']).lean(),
      ctx.tx.db.GroupUserAgent.find({ group: groupId }).select(['userAgent']).lean(),
    ]);
    const count = await ctx.tx.db.UserAgent.countDocuments({
      id: _.map(userAgents, 'userAgent'),
      role: _.map(roles, 'role'),
      disabled: { $ne: true },
    });
    if (count + 1 > limit.limit) {
      throw new Error('Cannot add the user exceeds the maximum limit.');
    }
  }

  return true;
}

module.exports = { checkIfCanCreateUserAgentInGroup };
