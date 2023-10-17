const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function list({ page, size, indexable = true, ctx }) {
  const query = { indexable };
  if (indexable === 'all') delete query.indexable;

  return mongoDBPaginate({ model: ctx.tx.db.Groups, page, size, query });
}

module.exports = { list };
