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
    knowledge: {
      type: String,
      // ref: 'plugins_academic-portfolio::knowledges',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ class: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const classKnowledgesModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassKnowledges',
  schema
);

module.exports = { classKnowledgesModel };
