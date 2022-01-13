const { tags: table } = require('../table');

module.exports = async function getTags(task, { tags = [], transacting } = {}) {
  const query = {
    task,
  };

  if (tags?.length) {
    query.tag_$in = tags;
  }
  const existingTags = await table.find(query, {
    transacting,
  });

  return { count: existingTags.length, tags: existingTags.map(({ tag }) => tag) };
};
