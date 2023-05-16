const { getUserAgentProfile } = require('../user-agents/getUserAgentProfile');

async function getProfileSysName(userSession, { transacting } = {}) {
  const profile = await getUserAgentProfile(userSession.userAgents[0], { transacting });
  return profile.sysName;
}

module.exports = { getProfileSysName };
