export const allManualActivitiesKey = [
  {
    plugin: 'plugin.scores',
    scope: 'manualActivities',
  },
];

export const allManualActivitiesSearchKey = [
  {
    ...allManualActivitiesKey[0],
    action: 'search',
  },
];

export const classManualActivitiesKey = ({ classId }) => [
  {
    ...allManualActivitiesKey[0],
    classId,
  },
];

export const manualActivitiesSearchKey = ({ classId, startDate, endDate, search }) => [
  {
    ...classManualActivitiesKey({ classId })[0],
    startDate,
    endDate,
    search,
  },
];

export const manualActivityScoresKey = ({ classId }) => [
  {
    ...allManualActivitiesKey[0],
    action: 'scores',
    classId,
  },
];

export const myManualActivityScoresKey = ({ classId, user }) => [
  {
    ...manualActivityScoresKey({ classId })[0],
    user,
  },
];
