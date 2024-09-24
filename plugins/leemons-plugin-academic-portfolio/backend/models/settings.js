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
    hideWelcome: {
      type: Boolean,
    },
    configured: {
      type: Boolean,
    },
    activeProviders: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const settingsModel = newModel(mongoose.connection, 'v1::academic-portfolio_Settings', schema);

module.exports = { settingsModel };
