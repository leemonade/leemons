const { transformArrayToObject } = require('../permissions/transformArrayToObject');
const { detail: roleDetail } = require('../roles/detail');
const { getUserAgentProfile } = require('../user-agents/getUserAgentProfile');

/**
 * @param {object} params - The params object.
 * @param {import('@leemons/deployment-manager').Context} params.ctx - The Moleculer context.
 * @param {import('@leemons/users').UserAgent} params.userAgent - The user agent.
 * @returns {Promise<import('@leemons/users').Profile>}
 */
async function getProfileByUserAgent({ ctx, userAgent }) {
  const profile = await getUserAgentProfile({
    userAgent: userAgent ?? ctx.meta.userSession.userAgents[0],
    ctx,
  });

  const role = await roleDetail({ id: profile.role, ctx });
  const permissions = transformArrayToObject(role.permissions);
  profile.permissions = permissions.normal;
  profile.targetPermissions = permissions.target;

  return profile;
}

module.exports = { getProfileByUserAgent };
