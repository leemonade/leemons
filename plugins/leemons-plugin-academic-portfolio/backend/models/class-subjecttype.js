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
    subjectType: {
      type: String,
      // ref: 'plugins_academic-portfolio::subjecttypes',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const classSubjectTypeModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_classSubjectType',
  schema
);

module.exports = { classSubjectTypeModel };
