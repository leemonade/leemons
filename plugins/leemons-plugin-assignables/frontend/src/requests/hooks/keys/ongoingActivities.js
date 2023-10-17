export const allOngoingActivitiesKey = [
  {
    plugin: 'plugin.assignables',
    scope: 'ongoingActivities',
  },
];

export const allOngoingActivitiesSearchKey = [
  {
    ...allOngoingActivitiesKey[0],
    action: 'search',
  },
];

export const ongoingActivitiesSearchKey = ({ userAgents, ...filters }) => [
  {
    ...allOngoingActivitiesSearchKey[0],

    userAgents,
    filters,
  },
];
