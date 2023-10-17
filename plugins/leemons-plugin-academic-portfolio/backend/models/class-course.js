const { mongoose, newModel } = require('@leemons/mongodb');

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
    class: {
      type: String,
      // ref: 'plugins_academic-portfolio::class',
    },
    course: {
      type: String,
      // ref: 'plugins_academic-portfolio::groups',
    },
  },
  {
    timestamps: true,
  }
);

const classCourseModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassCourse',
  schema
);

module.exports = { classCourseModel };
