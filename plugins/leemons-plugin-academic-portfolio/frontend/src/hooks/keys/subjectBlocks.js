export const allSubjectBlocksKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'subject-blocks',
  },
];

export const getSubjectBlocksKey = (subjectId) => [
  {
    ...allSubjectBlocksKeys[0],
    subjectId,
  },
];
