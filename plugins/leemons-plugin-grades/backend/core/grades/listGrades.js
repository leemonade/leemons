const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const { gradeByIds } = require('./gradeByIds');

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
