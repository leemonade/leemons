const { LeemonsError } = require('leemons-error');
const { pick, forEach, sortBy } = require('lodash');

async function getSubjects({ assignableIds, useIds = false, ctx }) {
  if (!assignableIds) {
    throw new LeemonsError(ctx, {
      message: 'Cannot get subjects: assignableIds is required',
      httpStatusCode: 400,
    });
  }
  const ids = Array.isArray(assignableIds) ? assignableIds : [assignableIds];

  const subjects = await ctx.tx.db.Subjects.find({ assignable: { $in: ids } }).lean();

  const subjectsPerAssignable = {};

  subjects.forEach((subject) => {
    const subjectData = pick(subject, ['program', 'subject', 'level', 'curriculum']);

    if (useIds) {
      subjectData.id = subject.id;
    }

    if (!subjectsPerAssignable[subject.assignable]) {
      subjectsPerAssignable[subject.assignable] = [subjectData];
    } else {
      subjectsPerAssignable[subject.assignable].push(subjectData);
    }
  });

  const sortedSubjectsPerAssignable = {};

  forEach(subjectsPerAssignable, (unsortedSubjects, key) => {
    const sortedSubjects = sortBy(unsortedSubjects, 'subject', 'level');

    sortedSubjectsPerAssignable[key] = sortedSubjects;
  });

  if (Array.isArray(assignableIds)) {
    return sortedSubjectsPerAssignable;
  }

  return sortedSubjectsPerAssignable[assignableIds] ?? [];
}

module.exports = { getSubjects };
