export const allHasProgramSubjectHistoryKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'knowledge-areas',
  },
];

export const getHasProgramSubjectHistoryKey = (program) => [
  {
    ...allHasProgramSubjectHistoryKeys,
    program,
  },
];
