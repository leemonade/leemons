const { mongoose, newModel } = require('@leemons/mongodb');

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
    hideWelcome: {
      type: Boolean,
    },
    configured: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const settingsModel = newModel(mongoose.connection, 'v1::tasks_Settings', schema);

module.exports = { settingsModel };
