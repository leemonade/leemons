export const allCourseDetailKeys = [
  {
    plugin: 'plugin.academic-portfolio',
    scope: 'course-detail',
  },
];

export const getCourseDetailKey = (id) => [
  {
    ...allCourseDetailKeys[0],
    id,
  },
];
