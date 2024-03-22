export const allProgramSubjectsKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'program-subjects',
  },
];

export const getProgramSubjectsKey = (program, filters) => [
  {
    ...allProgramSubjectsKeys,
    program,
    ...filters,
  },
];
