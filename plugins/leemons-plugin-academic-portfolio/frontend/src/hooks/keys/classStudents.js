export const allClassStudents = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'course-detail',
  },
];

export const getClassStudentsKey = (classId) => [
  {
    ...allClassStudents[0],
    classId,
  },
];
