const _ = require('lodash');
const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');
const { table } = require('../tables');
const { getUserAgentsInfo } = require('../user-agents');

async function detailByUri(uri, { transacting } = {}) {
  const group = await table.groups.findOne({ uri }, { transacting });
  if (!group) throw new global.utils.HttpError(404, `No role found for uri '${uri}'`);
  const [groupRoles, groupUserAgents] = await Promise.all([
    table.groupRole.find({ group: group.id }, { transacting }),
    table.groupUserAgent.find({ group: group.id }, { transacting }),
  ]);
  const [role, userAgents] = await Promise.all([
    roleDetail(groupRoles[0]?.role, { transacting }),
    getUserAgentsInfo(_.map(groupUserAgents, 'userAgent'), { withProfile: true, withCenter: true }),
  ]);
  const permissions = transformArrayToObject(role.permissions);
  group.userAgents = userAgents;
  group.permissions = permissions.normal;
  group.targetPermissions = permissions.target;
  return group;
}

module.exports = { detailByUri };
