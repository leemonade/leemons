const { mongoDBPaginate } = require('leemons-mongodb-helpers');
const _ = require('lodash');
const { classByIds } = require('./classByIds');

async function listClasses({ page, size, program, query, ctx }) {
  const response = await mongoDBPaginate({
    model: ctx.tx.db.Class,
    page,
    size,
    query: query || { program },
  });

  response.items = await classByIds({ ids: _.map(response.items, 'id'), ctx });

  return response;
}

module.exports = { listClasses };
