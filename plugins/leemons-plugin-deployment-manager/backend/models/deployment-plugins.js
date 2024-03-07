const { mongoose, newModel } = require('@leemons/mongodb');

const deploymentPluginsSchema = new mongoose.Schema(
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
    pluginName: {
      type: String,
      required: true,
    },
    pluginVersion: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

deploymentPluginsSchema.index({ deploymentID: 1, pluginName: 1 }, { unique: true });

deploymentPluginsSchema.index({ deploymentID: 1, pluginName: 1, isDeleted: 1 }, { unique: true });

const deploymentPluginsModel = newModel(
  mongoose.connection,
  'package-manager_DeploymentPlugins',
  deploymentPluginsSchema
);

module.exports = { deploymentPluginsModel };
