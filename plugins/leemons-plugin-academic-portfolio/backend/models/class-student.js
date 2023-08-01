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
    student: {
      type: String,
      // ref: 'plugins_users::user-agent',
    },
  },
  {
    timestamps: true,
  }
);

const classStudentModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassStudent',
  schema
);

module.exports = { classStudentModel };
