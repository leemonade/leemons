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
    program: {
      type: String,
      // ref: 'plugins_academic-portfolio::programs',
    },
    center: {
      type: String,
      // ref: 'plugins_users::centers',
    },
  },
  {
    timestamps: true,
  }
);

const programCenterModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ProgramCenter',
  schema
);

module.exports = { programCenterModel };
