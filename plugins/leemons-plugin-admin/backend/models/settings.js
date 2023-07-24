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
    configured: {
      type: Boolean,
    },
    status: {
      type: String,
      default: 'NONE',
    },
    lang: {
      type: String,
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

const settingsModel = newModel(mongoose.connection, 'v1::admin_Settings', schema);

module.exports = { settingsModel };
