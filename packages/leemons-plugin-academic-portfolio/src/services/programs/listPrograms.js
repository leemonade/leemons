const _ = require('lodash');
const { table } = require('../tables');

async function listPrograms(page, size, { transacting } = {}) {
  const results = await global.utils.paginate(table.programs, page, size, undefined, {
    transacting,
  });
  const programCenter = await table.programCenter.find(
    { program_$in: _.map(results.items, 'id') },
    { transacting }
  );
  const centersByProgram = _.groupBy(programCenter, 'program');
  results.items = results.items.map((program) => ({
    ...program,
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
  }));
  return results;
}

module.exports = { listPrograms };
