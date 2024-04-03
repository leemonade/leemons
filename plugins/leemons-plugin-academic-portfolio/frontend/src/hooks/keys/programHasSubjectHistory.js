export const allHasProgramSubjectHistoryKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'has-program-subject-history',
  },
];

export const getHasProgramSubjectHistoryKey = (program) => [
  {
    ...allHasProgramSubjectHistoryKeys,
    program,
  },
];
