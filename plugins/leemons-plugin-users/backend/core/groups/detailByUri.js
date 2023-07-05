const _ = require('lodash');
const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');
const { getUserAgentsInfo } = require('../user-agents');

async function detailByUri({ uri, ctx }) {
  const group = await ctx.tx.db.Groups.findOne({ uri }).lean();
  if (!group) throw new global.utils.HttpError(404, `No role found for uri '${uri}'`);
  const [groupRoles, groupUserAgents] = await Promise.all([
    ctx.tx.db.GroupRole.find({ group: group.id }).lean(),
    ctx.tx.db.GroupUserAgent.find({ group: group.id }).lean(),
  ]);
  const [role, userAgents] = await Promise.all([
    roleDetail({ id: groupRoles[0]?.role, ctx }),
    getUserAgentsInfo({
      userAgentIds: _.map(groupUserAgents, 'userAgent'),
      withProfile: true,
      withCenter: true,
      ctx,
    }),
  ]);
  const permissions = transformArrayToObject(role.permissions);
  group.userAgents = userAgents;
  group.permissions = permissions.normal;
  group.targetPermissions = permissions.target;
  return group;
}

module.exports = { detailByUri };
