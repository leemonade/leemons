const { table } = require('../tables');

async function agentDetailForPage(userAgentId, { userSession, transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const [[tags], userAgent] = await Promise.all([
    tagsService.getValuesTags(userAgentId, {
      type: 'plugins.users.user-agent',
      transacting,
    }),
    table.userAgent.findOne({ id: userAgentId }, { transacting }),
  ]);

  return { tags, user: userAgent.user };
}

module.exports = { agentDetailForPage };
