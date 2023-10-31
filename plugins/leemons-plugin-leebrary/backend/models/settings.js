const { mongoose, newModel } = require('@leemons/mongodb');

const settingsSchema = new mongoose.Schema(
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
    minimize: false,
  }
);

const settingsModel = newModel(mongoose.connection, 'v1::leebrary_Settings', settingsSchema);

module.exports = { settingsSchema, settingsModel };
