const _ = require('lodash');

async function removeSubjectCreditsBySubjectsIds({ subjectIds, soft, ctx }) {
  const programSubjectCredits = await ctx.tx.db.ProgramSubjectsCredits.find({
    subject: subjectIds,
  }).lean();
  await ctx.tx.emit('before-remove-program-subject-credits', {
    programSubjectCredits,
    soft,
  });
  await ctx.tx.db.ProgramSubjectsCredits.deleteMany(
    { id: _.map(programSubjectCredits, 'id') },
    { soft }
  );
  await ctx.tx.emit('after-remove-program-subject-credits', {
    programSubjectCredits,
    soft,
  });
  return true;
}

module.exports = { removeSubjectCreditsBySubjectsIds };
