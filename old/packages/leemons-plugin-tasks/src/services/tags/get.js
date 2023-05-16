const { tags: table } = require('../table');
const parseId = require('../task/helpers/parseId');

module.exports = async function getTags(task, { tags = [], transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });

  const query = {
    task: id,
  };

  if (tags?.length) {
    query.tag_$in = tags;
  }
  const existingTags = await table.find(query, {
    transacting,
  });

  return { count: existingTags.length, tags: existingTags.map(({ tag }) => tag) };
};
