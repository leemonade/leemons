const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const _ = require('lodash');
const { classByIds } = require('./classByIds');

async function listClasses({ page, size, program, query, options, ctx }) {
  const response = await mongoDBPaginate({
    model: ctx.tx.db.Class,
    page,
    size,
    query: query || { program },
    options,
  });

  response.items = await classByIds({ ids: _.map(response.items, 'id'), ctx });

  // Order by createdAt
  response.items = _.orderBy(response.items, ['createdAt'], ['desc']);

  return response;
}

module.exports = { listClasses };
