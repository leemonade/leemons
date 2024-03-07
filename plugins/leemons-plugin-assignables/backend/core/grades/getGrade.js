const { LeemonsError } = require('@leemons/error');

async function getGrade({ assignation, subject, type, visibleToStudent, ctx }) {
  if (!assignation) {
    throw new LeemonsError(ctx, {
      message: 'Cannot getGrade: assignation is required',
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

  if (visibleToStudent !== undefined) {
    query.visibleToStudent = visibleToStudent;
  }

  const grades = await ctx.tx.db.Grades.find(query).lean();

  return grades;
}

module.exports = { getGrade };
