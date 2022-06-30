module.exports = {
  modelName: 'config',
  collectionName: 'config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    program: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
       */
    },
    allCoursesHaveSameConfig: {
      type: 'boolean',
    },
    allCoursesHaveSameDates: {
      type: 'boolean',
    },
    courseDates: {
      type: 'json',
      /*
      {courseID: {startDate: Date, endDate: Date}}
      */
    },
    allCoursesHaveSameDays: {
      type: 'boolean',
    },
    courseDays: {
      type: 'json',
      /*
      Se almacenan los weekDay de la semana
      {courseID: [1,2,5]}
      */
    },
    allCoursesHaveSameHours: {
      type: 'boolean',
    },
    allDaysHaveSameHours: {
      type: 'boolean',
    },
    courseHours: {
      type: 'json',
      /*
      Se almacenan los weekDay de la semana
      {courseId: {
      1: {startDate: Date, endDate: Date},
      2: {startDate: Date, endDate: Date},
      5: {startDate: Date, endDate: Date}
      }}
      */
    },
    breaks: {
      type: 'json',
      /*
      [{name: 'Recreo', courses: [courseId], startDate: Date, endDate: Date}]
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
