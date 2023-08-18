const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    //
    program: {
      // ref: 'plugins_academic-portfolio::programs',
      type: String,
    },
    regionalConfig: {
      // ref: 'plugins_academic-calendar::regional-config',
      type: String,
    },
    allCoursesHaveSameConfig: {
      type: Boolean,
    },
    allCoursesHaveSameDates: {
      type: Boolean,
    },
    courseDates: {
      type: String,
      /*
      {courseID: {startDate: Date, endDate: Date}}
      */
    },
    courseEvents: {
      type: String,
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
      type: String,
      /*
      {courseId: {substageId: {startDate: Date, endDate: Date}}}
      */
    },
    allCoursesHaveSameDays: {
      type: Boolean,
    },
    breaks: {
      type: String,
      /*
      [{name: 'Recreo', courses: [courseId], startDate: Date, endDate: Date}]
      */
    },
  },
  {
    timestamps: true,
  }
);

const configModel = newModel(mongoose.connection, 'v1::academic-calendar_Config', schema);

module.exports = { configModel };
