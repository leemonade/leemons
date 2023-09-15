const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function list({ page = 0, size = 10, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.Categories,
    page,
    size,
    query: { id: { $exists: true } },
    sort: { order: 'asc' },
  });
}

module.exports = { list };
