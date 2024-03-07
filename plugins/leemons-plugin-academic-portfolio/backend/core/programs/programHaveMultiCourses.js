async function programHaveMultiCourses({ id, ctx }) {
  const program = await ctx.tx.db.Programs.findOne({ id })
    .select(['id', 'moreThanOneAcademicYear'])
    .lean();

  return program.moreThanOneAcademicYear;
}

module.exports = { programHaveMultiCourses };
