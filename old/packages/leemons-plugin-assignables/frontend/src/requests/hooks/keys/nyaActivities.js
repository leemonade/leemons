export const allNyaActivitiesKey = [
  {
    plugin: 'plugin.assignables',
    scope: 'nyaActivities',
  },
];

export const allNyaActivitiesSearchKey = [
  {
    ...allNyaActivitiesKey[0],
    action: 'search',
  },
];

export const nyaActivitiesSearchKey = ({ userAgents, ...filters }) => [
  {
    ...allNyaActivitiesSearchKey[0],

    userAgents,
    filters,
  },
];
