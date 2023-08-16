async function getNextCourseIndex({ program, ctx }) {
  const config = await ctx.tx.db.Configs.findOne({ key: `program-${program}-course-index` }).lean();
  if (!config) return 1;
  return parseInt(config.value, 10) + 1;
}

module.exports = { getNextCourseIndex };
