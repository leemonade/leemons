const _ = require('lodash');
const { table } = require('../tables');

async function listPrograms(page, size, center, { transacting } = {}) {
  const programCenter = await table.programCenter.find({ center }, { transacting });
  const results = await global.utils.paginate(
    table.programs,
    page,
    size,
    { id_$in: _.map(programCenter, 'program') },
    {
      transacting,
    }
  );

  const centersByProgram = _.groupBy(programCenter, 'program');
  results.items = results.items.map((program) => ({
    ...program,
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
  }));
  return results;
}

module.exports = { listPrograms };
