async function getCourseById({ id, ctx }) {
  const course = await ctx.tx.db.Groups.findOne({ id, type: 'course' }).lean();
  const manager = await ctx.tx.db.Managers.findOne({ relationship: id }).lean();
  return {
    ...course,
    manager: manager?.userAgent ?? null,
  };
}

module.exports = { getCourseById };
