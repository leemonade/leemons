const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listGroups({ page, size, program, query, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.Groups,
    page,
    size,
    query: { ...query, program, type: 'group' },
  });
}

module.exports = { listGroups };
