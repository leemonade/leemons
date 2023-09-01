async function haveGrades({ ctx }) {
  const grades = await ctx.tx.db.Grades.countDocuments({});
  return !!grades;
}

module.exports = { haveGrades };
