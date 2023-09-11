const { validateGrade } = require('../../validations/validateGrade');

async function registerGrade({
  assignation,
  subject,
  type,
  grade,
  gradedBy,
  feedback,
  visibleToStudent,
  ctx,
}) {
  // TODO: Check permissions
  const query = {
    assignation,
    subject,
    type,
  };

  const newValue = {
    grade,
    gradedBy,
    feedback,
    visibleToStudent,
  };

  validateGrade({
    ...query,
    ...newValue,
  });

  const response = await ctx.tx.db.Grades.findOneAndUpdate(query, newValue, {
    new: true,
    upsert: true,
  });

  return response;
}

module.exports = { registerGrade };
