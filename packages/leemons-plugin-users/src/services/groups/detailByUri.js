const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');
const { table } = require('../tables');

async function detailByUri(uri, { transacting } = {}) {
  const group = await table.groups.findOne({ uri }, { transacting });
  if (!group) throw new global.utils.HttpError(404, `No role found for uri '${uri}'`);
  const groupRoles = await table.groupRole.find({ group: group.id }, { transacting });
  const role = await roleDetail(groupRoles[0]?.role, { transacting });
  const permissions = transformArrayToObject(role.permissions);
  group.permissions = permissions.normal;
  group.targetPermissions = permissions.target;
  return group;
}

module.exports = { detailByUri };
