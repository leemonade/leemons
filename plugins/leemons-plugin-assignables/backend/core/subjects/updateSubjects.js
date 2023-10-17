const { differenceWith, isEqual, omit, map } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getSubjects } = require('./getSubjects');
const { saveSubjects } = require('./saveSubjects');
const { removeSubjects } = require('./removeSubjects');

async function updateSubjects({ assignable, subjects, ctx }) {
  if (!assignable || !Array.isArray(subjects)) {
    throw new LeemonsError(ctx, {
      message: 'Cannot update subjects: assignable and subjects are required',
      httpStatusCode: 400,
    });
  }

  const savedSubjects = await getSubjects({
    assignableIds: assignable,
    useIds: true,
    ctx,
  });

  const subjectsToAdd = differenceWith(subjects, savedSubjects, (a, b) =>
    isEqual(a, omit(b, ['id']))
  );
  const subjectsToRemove = differenceWith(savedSubjects, subjects, (a, b) =>
    isEqual(omit(a, ['id']), b)
  );

  if (subjectsToAdd.length) {
    await saveSubjects({
      assignableId: assignable,
      subjects: subjectsToAdd,
      ctx,
    });
  }
  if (subjectsToRemove.length) {
    await removeSubjects({ ids: map(subjectsToRemove, 'id'), ctx });
  }

  return getSubjects({ assignableIds: assignable, ctx });
}

module.exports = { updateSubjects };
