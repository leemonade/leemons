const { LeemonsError } = require('leemons-error');
const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');

async function detailByUri({ uri, ctx }) {
  const profile = await ctx.tx.db.Profiles.findOne({ uri }).lean();
  if (!profile) {
    throw new LeemonsError(ctx, {
      httpStatusCode: 404,
      message: `No profile found for uri '${uri}'`,
    });
  }
  const role = await roleDetail({ id: profile.role, ctx });
  const permissions = transformArrayToObject(role.permissions);
  profile.permissions = permissions.normal;
  profile.targetPermissions = permissions.target;
  return profile;
}

module.exports = { detailByUri };
