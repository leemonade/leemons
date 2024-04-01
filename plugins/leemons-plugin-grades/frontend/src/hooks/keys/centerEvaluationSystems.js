export const allCenterEvaluationSystemsKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'knowledge-areas',
  },
];

export const getCenterEvaluationSystemsKey = (center) => [
  {
    ...allCenterEvaluationSystemsKeys,
    center,
  },
];
