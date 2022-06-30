const _ = require('lodash');
const { table } = require('../tables');

async function getTags({ type, transacting }) {
  const query = {};
  if (type) {
    query.type = type;
  }
  const tags = await table.tags.find(query, { columns: ['tag'], transacting });
  return _.map(tags, 'tag');
}

module.exports = { getTags };
