module.exports = async function deleteTimetable({ timetableId, ctx }) {
  const { deletedCount } = await ctx.tx.db.Timetable.deleteMany({ id: timetableId });

  return deletedCount > 0;
};
