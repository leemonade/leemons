export const allProgramCoursesKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'program-courses',
  },
];

export const getProgramCoursesKey = (programId, size, page) => [
  {
    ...allProgramCoursesKeys[0],
    programId,
    size,
    page,
  },
];
