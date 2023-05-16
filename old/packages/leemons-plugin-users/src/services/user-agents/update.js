const { table } = require('../tables');
const { setUserDatasetInfo } = require('./setUserDatasetInfo');

async function update(userAgentId, { tags }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const tagsService = leemons.getPlugin('common').services.tags;
      const promises = [];
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
