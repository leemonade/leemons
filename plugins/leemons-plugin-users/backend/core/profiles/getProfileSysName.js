const { getUserAgentProfile } = require('../user-agents/getUserAgentProfile');

async function getProfileSysName({ ctx }) {
  const profile = await getUserAgentProfile({ userAgent: ctx.meta.userSession.userAgents[0], ctx });
  return profile.sysName;
}

module.exports = { getProfileSysName };
