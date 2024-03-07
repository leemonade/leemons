const { getUserAgentProfile } = require('../user-agents/getUserAgentProfile');
const { isSuperAdmin } = require('../users/isSuperAdmin');

async function getProfileSysName({ ctx }) {
  const profile = await getUserAgentProfile({ userAgent: ctx.meta.userSession.userAgents[0], ctx });
  if (!profile) {
    const isSuper = await isSuperAdmin({ userId: ctx.meta.userSession.id, ctx });
    if (isSuper) return 'super';
  }
  return profile?.sysName;
}

module.exports = { getProfileSysName };
