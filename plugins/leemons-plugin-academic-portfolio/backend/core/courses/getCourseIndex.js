async function getCourseIndex({ course, ctx }) {
  const { index } = await ctx.tx.db.Groups.findOne({ id: course, type: 'course' })
    .select(['id', 'index'])
    .lean();
  return index;
}

module.exports = { getCourseIndex };
