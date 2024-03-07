const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
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
    minimize: false,
  }
);

schema.index({ class: 1, course: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ class: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ course: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ group: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const classCourseModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassCourse',
  schema
);

module.exports = { classCourseModel };
