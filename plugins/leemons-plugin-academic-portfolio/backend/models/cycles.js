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
  },
  {
    timestamps: true,
  }
);

const cyclesModel = newModel(mongoose.connection, 'v1::academic-portfolio_Cycles', schema);

module.exports = { cyclesModel };
