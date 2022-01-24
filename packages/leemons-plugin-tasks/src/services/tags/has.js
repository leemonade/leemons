const parseId = require('../task/helpers/parseId');
const get = require('./get');

module.exports = async function hasTags(task, tags, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });

  const _tags = Array.isArray(tags) ? tags : [tags];

  const { tags: existingTags } = await get(id, { tags: _tags, transacting });

  const queriedCount = _tags.length;
  const existingCount = existingTags.length;
  const nonExistingCount = queriedCount - existingCount;

  return {
    existingCount,
    nonExistingCount,
    existingTags,
    nonExistingTags: _tags.filter((tag) => !existingTags.includes(tag)),
  };
};
