const _ = require('lodash');

async function getProgramSubjectDigits({ program, ctx }) {
  const { subjectsDigits } = await ctx.tx.db.Programs.findOne({ id: program }).select([
    'id',
    'subjectsDigits',
  ]);
  return subjectsDigits;
}

module.exports = { getProgramSubjectDigits };
