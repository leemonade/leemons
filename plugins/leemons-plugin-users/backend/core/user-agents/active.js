const _ = require('lodash');
const {
  checkIfCanCreateNUserAgentsInRoleProfiles,
} = require('../users/checkIfCanCreateNUserAgentsInRoleProfiles');
const {
  checkIfCanCreateUserAgentInGroup,
} = require('../groups/checkIfCanCreateNUserAgentsInGroup');

async function active({ id, ctx }) {
  // checkIfCanCreateUserAgentInGroup
  const [userAgent, groups] = await Promise.all([
    ctx.tx.db.UserAgent.findOne({ id }).lean(),
    ctx.tx.db.GroupUserAgent.find({ userAgent: id }).select(['id']).lean(),
  ]);
  // De todos los grupos en los que esta el usuario vamos a sacar cuales son de tipo role
  const roleGroups = await ctx.tx.db.Groups.find({ type: 'role', id: _.map(groups, 'id') })
    .select(['id'])
    .lean();

  await Promise.all([
    checkIfCanCreateNUserAgentsInRoleProfiles({ nUserAgents: 1, role: userAgent.role, ctx }),
    Promise.all(
      _.map(roleGroups, (group) =>
        checkIfCanCreateUserAgentInGroup({ userAgentId: id, groupId: group.id, ctx })
      )
    ),
  ]);
  return ctx.tx.db.UserAgent.findOneAndUpdate({ id }, { disabled: false }, { new: true });
}

module.exports = {
  active,
};
