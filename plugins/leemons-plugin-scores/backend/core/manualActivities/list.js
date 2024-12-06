async function listManualActivitiesForClassAndPeriod({ classId, startDate, endDate, ctx }) {
  return await ctx.tx.db.ManualActivities.find({
    classId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).select({
    _id: 0,
    id: 1,
    name: 1,
    description: 1,
    date: 1,
    classId: 1,
  });
}

module.exports = listManualActivitiesForClassAndPeriod;
