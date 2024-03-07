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
      // ref: 'plugins_academic-portfolio::programs',
    },
    center: {
      type: String,
      // ref: 'plugins_users::centers',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ center: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ program: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const programCenterModel = newModel(
  mongoose.connection,
  'v1::academic-portfolio_ProgramCenter',
  schema
);

module.exports = { programCenterModel };
