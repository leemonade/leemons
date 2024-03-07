const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function list({ page, size, query, ctx }) {
  return mongoDBPaginate({
    model: ctx.tx.db.Families,
    page,
    size,
    query,
  });
}

module.exports = { list };
