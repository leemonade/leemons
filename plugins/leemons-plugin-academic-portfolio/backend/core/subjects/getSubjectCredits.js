const _ = require('lodash');

async function getSubjectCredits({ subject, program, ctx }) {
  const response = await ctx.tx.db.ProgramSubjectsCredits.find({
    subject: _.isArray(subject) ? subject : [subject],
    program: _.isArray(program) ? program : [program],
  }).lean();
  return _.isArray(subject) || _.isArray(program) ? response : response[0];
}

async function getSubjectsCredits({ subjects, ctx }) {
  if (subjects.length === 0) {
    return [];
  }
  const query = subjects.map((subject) => _.pick(subject, ['subject', 'program']));
  return ctx.tx.db.ProgramSubjectsCredits.find({ $or: query }).lean();
}

module.exports = { getSubjectCredits, getSubjectsCredits };
