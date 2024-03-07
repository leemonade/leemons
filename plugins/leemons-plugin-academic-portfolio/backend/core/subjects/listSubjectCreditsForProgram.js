const _ = require('lodash');

async function listSubjectCreditsForProgram({ program, ctx }) {
  return ctx.tx.db.ProgramSubjectsCredits.find({
    program: _.isArray(program) ? program : [program],
  }).lean();
}

module.exports = { listSubjectCreditsForProgram };
