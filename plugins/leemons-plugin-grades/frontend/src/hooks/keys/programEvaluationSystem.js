export const allProgramsEvaluationSystemsKeys = [
  {
    plugin: 'plugin.grades',
    scope: 'program-evaluation-systems',
  },
];

export const getProgramEvaluationSystemKey = (program) => [
  {
    ...allProgramsEvaluationSystemsKeys[0],
    program,
  },
];
