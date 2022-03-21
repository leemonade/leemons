const _ = require('lodash');
const { table } = require('../tables');

async function listTags(page, size, { query = {}, transacting }) {
  const results = await global.utils.paginate(table.tags, page, size, query, {
    columns: ['tag'],
    transacting,
  });
  results.items = _.map(results.items, 'tag');
  return results;
}

module.exports = { listTags };
