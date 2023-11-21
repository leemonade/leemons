const { LeemonsError } = require('@leemons/error');
const { isString, some, negate } = require('lodash');

async function removeSubjects({ ids, ctx }) {
  if (!ids || some(ids, negate(isString))) {
    throw new LeemonsError(ctx, {
      message: 'Cannot remove subjects: Ids must be strings',
      httpStatusCode: 400,
    });
  }

  const { deletedCount } = await ctx.tx.db.Subjects.deleteMany({
    id: ids,
  });

  return deletedCount;
}

module.exports = { removeSubjects };
