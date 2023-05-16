const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');
const { table } = require('../tables');

async function detailByUri(uri) {
  const profile = await table.profiles.findOne({ uri });
  if (!profile) throw new global.utils.HttpError(404, `No profile found for uri '${uri}'`);
  const role = await roleDetail(profile.role);
  const permissions = transformArrayToObject(role.permissions);
  profile.permissions = permissions.normal;
  profile.targetPermissions = permissions.target;
  return profile;
}

module.exports = { detailByUri };
