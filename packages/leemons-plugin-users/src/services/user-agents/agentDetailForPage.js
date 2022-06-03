const { table } = require('../tables');
const { getUserAgentDatasetInfo } = require('./getUserAgentDatasetInfo');

async function agentDetailForPage(userAgentId, { transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const [datasetInfo, [tags], userAgent] = await Promise.all([
    getUserAgentDatasetInfo(userAgentId, { transacting }),
    tagsService.getValuesTags(userAgentId, {
      type: 'plugins.users.user-agent',
      transacting,
    }),
    table.userAgent.findOne({ id: userAgentId }, { transacting }),
  ]);

  return { ...datasetInfo, tags, user: userAgent.user };
}

module.exports = { agentDetailForPage };
