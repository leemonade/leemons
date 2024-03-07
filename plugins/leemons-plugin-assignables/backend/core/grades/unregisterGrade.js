const { LeemonsError } = require('@leemons/error');

async function unregisterGrade({ assignation, subject, type, ctx }) {
  if (!assignation) {
    throw new LeemonsError(ctx, {
      message: 'Cannot unregister grade: assignation is required',
      httpStatusCode: 400,
    });
  }
  // TODO: Check permissions
  const query = {
    assignation,
  };

  if (subject) {
    query.subject = subject;
  }

  if (type) {
    query.type = type;
  }

  const { deletedCount } = await ctx.tx.db.Grades.deleteMany(query);

  return deletedCount;
}

module.exports = { unregisterGrade };
