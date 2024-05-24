async function getGroupById({ id, ctx }) {
  const group = await ctx.tx.db.Groups.findOne({ id, type: 'group' }).lean();
  const programCourses = await ctx.tx.db.Groups.find({
    program: group.program,
    type: 'course',
  }).lean();
  const manager = await ctx.tx.db.Managers.findOne({ relationship: id }).lean();
  if (group.metadata) {
    return {
      ...group,
      manager: manager?.userAgent ?? null,
      parentCourseSeats: programCourses.find((crs) => crs.index === group.metadata.course)?.metadata
        .seats,
    };
  }
  // This handles the case of programs with non-sequential courses. Where a metadata object is not needed. All courses have the same number of seats.
  return {
    ...group,
    manager: manager?.userAgent ?? null,
    parentCourseSeats: programCourses[0].metadata.seats,
  };
}

module.exports = { getGroupById };
