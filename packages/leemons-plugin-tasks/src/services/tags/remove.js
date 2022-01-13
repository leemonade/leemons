const { tags: table } = require('../table');

module.exports = async function removeTags(task, tags, { transacting } = {}) {
  const _tags = Array.isArray(tags) ? tags : [tags];

  const query = {
    task,
  };

  if (_tags.length) {
    query.tag_$in = _tags;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  return deleted;
};
