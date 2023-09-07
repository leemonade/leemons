const _ = require('lodash');
const { gradeByIds } = require('./gradeByIds');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function listGrades({ page, size, center, ctx }) {
  const results = await mongoDBPaginate({
    model: ctx.tx.db.Grades,
    page,
    size,
    query: { center },
  });

  results.items = await gradeByIds({ ids: _.map(results.items, 'id'), ctx });

  return results;
}

module.exports = { listGrades };
