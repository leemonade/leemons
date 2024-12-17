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
