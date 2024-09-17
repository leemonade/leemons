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
    program: {
      type: String,
      required: true,
      // ref: 'plugins_academic-portfolio::programs',
    },
    subject: {
      type: String,
      required: true,
      // ref: 'plugins_academic-portfolio::subjects',
    },
    name: {
      type: String,
      required: true,
    },
    abbreviation: {
      type: String,
      required: true,
    },
    // NOT ZERO INDEXED
    index: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1 });

const blocksModel = newModel(mongoose.connection, 'v1::academic-portfolio_Blocks', schema);

module.exports = { blocksModel };
