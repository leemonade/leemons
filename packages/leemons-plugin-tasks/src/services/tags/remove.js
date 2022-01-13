const { tags: table } = require('../table');

module.exports = async function removeTags(task, tags, { transacting } = {}) {
  const _tags = Array.isArray(tags) ? tags : [tags];

  const deleted = await table.deleteMany(
    {
      tag_$in: _tags,
      task,
    },
    {
      transacting,
    }
  );

  return deleted;
};
