const { mongoose, newModel } = require('@leemons/mongodb');

const pinsSchema = new mongoose.Schema(
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
    //
    asset: {
      type: String,
    },
    userAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

pinsSchema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
pinsSchema.index({ asset: 1, deploymentID: 1, isDeleted: 1 });
pinsSchema.index({ asset: 1, userAgent: 1, deploymentID: 1, isDeleted: 1 });
pinsSchema.index({ userAgent: 1, deploymentID: 1, isDeleted: 1 });

const pinsModel = newModel(mongoose.connection, 'v1::leebrary_Pins', pinsSchema);

module.exports = { pinsModel, pinsSchema };
