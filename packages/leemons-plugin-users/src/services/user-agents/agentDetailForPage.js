const { getUserAgentDatasetInfo } = require('./getUserAgentDatasetInfo');

async function agentDetailForPage(userAgentId, { transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const [datasetInfo, [tags]] = await Promise.all([
    getUserAgentDatasetInfo(userAgentId, { transacting }),
    tagsService.getValuesTags(userAgentId, {
      type: 'plugins.users.user-agent',
      transacting,
    }),
  ]);

  console.log(tags);

  return { ...datasetInfo, tags };
}

module.exports = { agentDetailForPage };
