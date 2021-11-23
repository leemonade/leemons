const _ = require('lodash');
const { table } = require('../tables');
const { gradeByIds } = require('./gradeByIds');

async function listGrades(page, size, center, { transacting } = {}) {
  const results = await global.utils.paginate(
    table.grades,
    page,
    size,
    { center },
    {
      transacting,
    }
  );

  results.items = await gradeByIds(_.map(results.items, 'id'), { transacting });

  return results;
}

module.exports = { listGrades };
