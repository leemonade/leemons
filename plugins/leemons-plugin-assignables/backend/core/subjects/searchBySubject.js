const { LeemonsError } = require('leemons-error');
const { compact, isArray, difference } = require('lodash');

async function searchBySubject({ id, ctx }) {
  if (!id) {
    throw new LeemonsError(ctx, {
      message: 'Cannot search by subject: id is required',
      httpStatusCode: 400,
    });
  }

  const ids = compact(isArray(id) ? id : [id]);
  const subjects = await ctx.tx.db.Subjects.find({
    subject: { $in: id },
  })
    .select(['assignable', 'subject'])
    .lean();

  const subjectsByAssignable = {};

  subjects.forEach(({ assignable, subject }) => {
    if (!subjectsByAssignable[assignable]) {
      subjectsByAssignable[assignable] = [subject];
    } else {
      subjectsByAssignable[assignable].push(subject);
    }
  });

  const assignablesHavingExactSubjects = Object.entries(subjectsByAssignable)
    .filter(([, iteratorSubjects]) => !difference(ids, iteratorSubjects).length)
    .map(([assignable]) => assignable);

  return assignablesHavingExactSubjects;
}

module.exports = { searchBySubject };
