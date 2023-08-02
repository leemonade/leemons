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
    substage: {
      type: String,
      // ref: 'plugins_academic-portfolio::groups',
    },
  },
  {
    timestamps: true,
  }
);

const classSubstageModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassSubstage',
  schema
);

module.exports = { classSubstageModel };
