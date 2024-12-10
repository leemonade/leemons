export const allManualActivitiesKey = [
  {
    plugin: 'plugin.scores',
    scope: 'scores',
  },
];

export const allManualActivitiesSearchKey = [
  {
    ...allManualActivitiesKey[0],
    action: 'search',
  },
];

export const manualActivitiesSearchKey = ({ classId, startDate, endDate }) => [
  {
    ...allManualActivitiesSearchKey[0],

    classId,
    startDate,
    endDate,
  },
];
