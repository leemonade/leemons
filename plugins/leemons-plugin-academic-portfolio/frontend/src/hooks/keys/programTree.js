export const allProgramTreeKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'program-tree',
  },
];

export const getProgramTreeKey = (program) => [
  {
    ...allProgramTreeKeys[0],
    program,
  },
];
