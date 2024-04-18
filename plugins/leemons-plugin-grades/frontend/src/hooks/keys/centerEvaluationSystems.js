export const allCenterEvaluationSystemsKeys = [
  {
    plugin: 'plugin.grades',
    scope: 'center-evaluation-systems',
  },
];

export const getCenterEvaluationSystemsKey = (center) => [
  {
    ...allCenterEvaluationSystemsKeys[0],
    center,
  },
];
