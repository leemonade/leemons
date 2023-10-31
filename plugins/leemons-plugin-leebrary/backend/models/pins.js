const { mongoose, newModel } = require('@leemons/mongodb');

const pinsSchema = new mongoose.Schema(
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

const pinsModel = newModel(mongoose.connection, 'v1::leebrary_Pins', pinsSchema);

module.exports = { pinsModel, pinsSchema };
