const _ = require('lodash');
const { table } = require('../tables');

async function programsByIds(ids, { transacting } = {}) {
  const [programs, programCenter, programSubstage] = await Promise.all([
    table.programs.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    table.programCenter.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    table.programSubstage.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
  ]);
  const substages = await table.groups.find(
    { id_$in: _.map(programSubstage, 'substage') },
    { transacting }
  );
  const substagesById = _.keyBy(substages, 'id');
  const substageByProgram = _.groupBy(programSubstage, 'program');
  const centersByProgram = _.groupBy(programCenter, 'program');
  return programs.map((program) => ({
    ...program,
    centers: centersByProgram[program.id] ? _.map(centersByProgram[program.id], 'center') : [],
    substages: substageByProgram[program.id]
      ? _.map(substageByProgram[program.id], ({ substage }) => substagesById[substage])
      : [],
  }));
}

module.exports = { programsByIds };
