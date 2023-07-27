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
    //
    defaultCategory: {
      // ref: 'plugins_leebrary::categories'
      type: String,
    },
    providerName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const settingsModel = newModel(mongoose.connection, 'v1::leebrary_Settings', schema);

module.exports = { settingsModel };
