async function getGroupById({ id, ctx }) {
  const group = await ctx.tx.db.Groups.findOne({ id, type: 'group' }).lean();
  const programCourses = await ctx.tx.db.Groups.find({
    program: group.program,
    type: 'course',
  }).lean();
  const manager = await ctx.tx.db.Managers.findOne({ relationship: id }).lean();
  return {
    ...group,
    manager: manager?.userAgent ?? null,
    parentCourseSeats: programCourses.find((crs) => crs.index === group.metadata.course)?.metadata
      .seats,
  };
}

module.exports = { getGroupById };
