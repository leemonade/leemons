async function programHasSequentialCourses({ id, ctx }) {
  const program = await ctx.tx.db.Programs.findOne({ id })
    .select(['id', 'sequentialCourses'])
    .lean();

  return program.sequentialCourses;
}

module.exports = { programHasSequentialCourses };
