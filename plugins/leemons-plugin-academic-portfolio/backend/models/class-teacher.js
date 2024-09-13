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
    teacher: {
      type: String,
      // ref: 'plugins_users::user-agent',
    },
    // main-teacher | associate-teacher | invited-teacher
    type: {
      type: String,
      default: 'associate-teacher',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ class: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ class: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ teacher: 1, type: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ teacher: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const classTeacherModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassTeacher',
  schema
);

module.exports = { classTeacherModel };
