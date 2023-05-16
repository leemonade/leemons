const _ = require('lodash');
const { table } = require('../tables');

async function getTagsByName(name, { type, transacting }) {
  const query = { tag_$contains: name };
  if (type) {
    query.type = type;
  }
  const tags = await table.tags.find(query, { columns: ['tag'], transacting });
  return _.map(tags, 'tag');
}

module.exports = { getTagsByName };
