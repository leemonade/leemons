const { LeemonsError } = require('leemons-error');
const { compact, isArray, difference } = require('lodash');

async function searchByProgram({ id, ctx }) {
  if (!id) {
    throw new LeemonsError(ctx, {
      message: 'Cannot search by program: id is required',
      httpStatusCode: 400,
    });
  }

  const ids = compact(isArray(id) ? id : [id]);
  const programs = await ctx.tx.db.Subjects.find({
    program: { $in: id },
  })
    .select(['assignable', 'program'])
    .lean();

  const programsByAssignable = {};

  programs.forEach(({ assignable, program }) => {
    if (!programsByAssignable[assignable]) {
      programsByAssignable[assignable] = [program];
    } else {
      programsByAssignable[assignable].push(program);
    }
  });

  const assignablesHavingExactPrograms = Object.entries(programsByAssignable)
    .filter(([, iteratorPrograms]) => !difference(ids, iteratorPrograms).length)
    .map(([assignable]) => assignable);

  return assignablesHavingExactPrograms;
}

module.exports = { searchByProgram };
