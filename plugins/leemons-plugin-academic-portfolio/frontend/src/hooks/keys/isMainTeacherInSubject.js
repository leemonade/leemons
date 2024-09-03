export const allIsMainTeacherInSubjectKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'is-main-teacher-in-subject',
  },
];

export const getIsMainTeacherInSubjectKey = (subjectIds) => [
  {
    ...allIsMainTeacherInSubjectKeys[0],
    subjectIds,
  },
];
