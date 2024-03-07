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
    student: {
      type: String,
      // ref: 'plugins_users::user-agent',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ class: 1, student: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ class: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ student: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const classStudentModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassStudent',
  schema
);

module.exports = { classStudentModel };
