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
    name: {
      type: String,
    },
    program: {
      type: String,
      // ref: 'plugins_academic-portfolio::programs',
    },
    courses: {
      type: String,
    },
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

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, deploymentID: 1, isDeleted: 1 });

const cyclesModel = newModel(mongoose.connection, 'v1::academic-portfolio_Cycles', schema);

module.exports = { cyclesModel };
