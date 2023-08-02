const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listTags({ page, size, query = {}, ctx }) {
  const results = await mongoDBPaginate({
    model: ctx.tx.db.Tags,
    page,
    size,
    query,
    columns: ['tag'],
  });
  results.items = _.map(results.items, 'tag');
  return results;
}

module.exports = { listTags };
