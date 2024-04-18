export const allSubjectTypesKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'subject-types',
  },
];

export const getSubjectTypesKey = (center) => [
  {
    ...allSubjectTypesKeys[0],
    center,
  },
];
