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
    knowledge: {
      type: String,
      // ref: 'plugins_academic-portfolio::knowledges',
    },
  },
  {
    timestamps: true,
  }
);

const classKnowledgesModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ClassKnowledges',
  schema
);

module.exports = { classKnowledgesModel };
