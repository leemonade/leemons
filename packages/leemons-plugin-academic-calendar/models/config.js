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
    regionalConfig: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_academic-calendar::regional-config',
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
    courseEvents: {
      type: 'json',
      /*
        {courseId: [{
          periodName: String,
          dayType: 'schoolDays' || 'nonSchoolDays',
          withoutOrdinaryDays: Boolean,
          startDate: Date,
          endDate: Date || null,
          color: String
        }]
        }
      */
    },
    substagesDates: {
      type: 'json',
      /*
      {courseId: {substageId: {startDate: Date, endDate: Date}}}
      */
    },
    allCoursesHaveSameDays: {
      type: 'boolean',
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
