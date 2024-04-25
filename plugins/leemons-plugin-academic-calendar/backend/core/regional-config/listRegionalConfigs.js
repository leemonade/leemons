const dayjs = require('dayjs');

async function listRegionalConfigs({ center, ctx }) {
  const regionalConfigs = await ctx.tx.db.RegionalConfig.find({ center }).lean();
  const calendarsAssignedToAProgram = await ctx.tx.db.Config.find({
    program: { $exists: true },
  }).lean();

  return regionalConfigs.map((regionalConfig) => {
    const assignedCalendars = calendarsAssignedToAProgram.filter(
      (calendar) => calendar.regionalConfig === regionalConfig.id
    );
    const assignedToAProgram = assignedCalendars.length > 0;

    const now = dayjs();
    let currentlyInUse = false;
    if (assignedToAProgram) {
      let earliestDate = null;
      let latestDate = null;

      assignedCalendars.forEach((calendar) => {
        const courseDates = JSON.parse(calendar.courseDates);
        Object.values(courseDates).forEach((dates) => {
          const startDate = dayjs(dates.startDate);
          const endDate = dayjs(dates.endDate);
          if (!earliestDate || startDate.isBefore(earliestDate)) {
            earliestDate = startDate;
          }
          if (!latestDate || endDate.isAfter(latestDate)) {
            latestDate = endDate;
          }
        });
      });

      currentlyInUse = now.isAfter(earliestDate) && now.isBefore(latestDate);
    }

    return {
      ...regionalConfig,
      regionalEvents: regionalConfig.regionalEvents
        ? JSON.parse(regionalConfig.regionalEvents)
        : null,
      localEvents: regionalConfig.localEvents ? JSON.parse(regionalConfig.localEvents) : null,
      daysOffEvents: regionalConfig.daysOffEvents ? JSON.parse(regionalConfig.daysOffEvents) : null,
      assignedToAProgram,
      currentlyInUse,
    };
  });
}

module.exports = { listRegionalConfigs };
