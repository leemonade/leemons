const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');
const { table } = require('../tables');

async function detailBySysName(sysName) {
  const profile = await table.profiles.findOne({ sysName });
  if (!profile) throw new global.utils.HttpError(404, `No profile found for sysName '${sysName}'`);
  const role = await roleDetail(profile.role);
  const permissions = transformArrayToObject(role.permissions);
  profile.permissions = permissions.normal;
  profile.targetPermissions = permissions.target;
  return profile;
}

module.exports = { detailBySysName };
