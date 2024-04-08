const { LeemonsError } = require('@leemons/error');
const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');

/**
 * Retrieves a profile by its sysName.
 *
 * @param {Object} params
 * @param {string} params.sysName - The sysName of the profile
 * @param {Object} params.ctx - The context object
 * @returns {Promise<Profile>} - The profile object
 */
async function detailBySysName({ sysName, ctx }) {
  const profile = await ctx.tx.db.Profiles.findOne({ sysName }).lean();
  if (!profile) {
    throw new LeemonsError(ctx, {
      httpStatusCode: 404,
      message: `No profile found for sysName '${sysName}'`,
    });
  }
  const role = await roleDetail({ id: profile.role, ctx });
  const permissions = transformArrayToObject(role.permissions);
  profile.permissions = permissions.normal;
  profile.targetPermissions = permissions.target;
  return profile;
}

module.exports = { detailBySysName };
