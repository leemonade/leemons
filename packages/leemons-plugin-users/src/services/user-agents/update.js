const { table } = require('../tables');
const { setUserAgentDatasetInfo } = require('./setUserAgentDatasetInfo');

async function update(userAgentId, { tags, dataset }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const tagsService = leemons.getPlugin('common').services.tags;
      const promises = [];
      if (dataset) promises.push(setUserAgentDatasetInfo(userAgentId, dataset, { transacting }));

      if (tags)
        promises.push(
          tagsService.setTagsToValues('plugins.users.user-agent', tags, userAgentId, {
            transacting,
          })
        );
      await Promise.all(promises);
      return true;
    },
    table.users,
    _transacting
  );
}

module.exports = { update };
