const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');
const { classByIds } = require('./classByIds');

async function listSubjectClasses({ page, size, subject, query, ctx }) {
  const response = await mongoDBPaginate({
    model: ctx.tx.db.Class,
    page,
    size,
    query: query || { subject },
  });

  response.items = await classByIds({ ids: _.map(response.items, 'id'), ctx });

  return response;
}

module.exports = { listSubjectClasses };
