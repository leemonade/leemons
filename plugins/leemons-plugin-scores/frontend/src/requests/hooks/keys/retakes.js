export const allRetakesKey = [
  {
    plugin: 'plugin.scores',
    scope: 'retakes',
  },
];

export const getRetakesKey = ({ classId, period }) => [
  {
    ...allRetakesKey[0],
    classId,
    period,
  },
];

export const allRetakeScoresKey = [
  {
    plugin: 'plugin.scores',
    scope: 'retakes.scores',
  },
];

export const getRetakeScoresKey = ({ classId, period, ...query }) => [
  {
    ...allRetakeScoresKey[0],
    ...query,
    classId,
    period,
  },
];
