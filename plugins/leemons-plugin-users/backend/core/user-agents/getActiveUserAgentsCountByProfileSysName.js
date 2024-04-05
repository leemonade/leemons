const { LeemonsError } = require('@leemons/error');
const { detailBySysName } = require('../profiles');

/**
 * Get the count of active user agents for a given profile sys name
 *
 * @param {Object} params
 * @param {string} params.sysName - The sys name of the profile
 * @param {MoleculerContext} params.ctx - The context of the request
 * @returns {Promise<number>} - The count of active user agents for the given profile
 */
async function getActiveUserAgentsCountByProfileSysName({ sysName, ctx }) {
  const profile = await detailBySysName({ sysName, ctx });

  if (!profile) {
    throw new LeemonsError(ctx, { message: 'Profile not found', httpStatusCode: 404 });
  }

  const { role } = await ctx.tx.db.ProfileRole.findOne({ profile: profile.id })
    .select(['role'])
    .lean();

  return ctx.tx.db.UserAgent.countDocuments({
    role,
    $or: [{ disabled: null }, { disabled: false }],
  });
}

module.exports = { getActiveUserAgentsCountByProfileSysName };
