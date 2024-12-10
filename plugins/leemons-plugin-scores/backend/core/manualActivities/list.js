const { escapeRegExp } = require('lodash');

async function listManualActivitiesForClassAndPeriod({ classId, startDate, endDate, search, ctx }) {
  const query = {
    classId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (search) {
    query.name = {
      $regex: escapeRegExp(search.trim()),
      $options: 'i',
    };
  }

  return await ctx.tx.db.ManualActivities.find(query).lean();
}

module.exports = listManualActivitiesForClassAndPeriod;
