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
    class: {
      type: String,
      // ref: 'plugins_academic-portfolio::class',
    },
    teacher: {
      type: String,
      // ref: 'plugins_users::user-agent',
    },
    // main-teacher | associate-teacher
    type: {
      type: String,
      default: 'associate-teacher',
    },
  },
  {
    timestamps: true,
  }
);

const classTeacherModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassTeacher',
  schema
);

module.exports = { classTeacherModel };
