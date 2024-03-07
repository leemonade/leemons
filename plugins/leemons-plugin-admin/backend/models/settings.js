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
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const settingsModel = newModel(mongoose.connection, 'v1::admin_Settings', schema);

module.exports = { settingsModel };
