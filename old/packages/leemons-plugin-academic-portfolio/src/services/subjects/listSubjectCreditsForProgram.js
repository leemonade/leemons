const _ = require('lodash');
const { table } = require('../tables');

async function listSubjectCreditsForProgram(program, { transacting } = {}) {
  return table.programSubjectsCredits.find(
    {
      program_$in: _.isArray(program) ? program : [program],
    },
    { transacting }
  );
}

module.exports = { listSubjectCreditsForProgram };
