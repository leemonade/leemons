export const allEvaluatedActivitiesKey = [
  {
    plugin: 'plugin.assignables',
    scope: 'evaluatedActivities',
  },
];

export const allEvaluatedActivitiesSearchKey = [
  {
    ...allEvaluatedActivitiesKey[0],
    action: 'search',
  },
];

export const evaluatedActivitiesSearchKey = ({ userAgents, ...filters }) => [
  {
    ...allEvaluatedActivitiesSearchKey[0],

    userAgents,
    filters,
  },
];
