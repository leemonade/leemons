const { mongoose, newModel } = require('@leemons/mongodb');

const deploymentPluginsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    domains: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

deploymentPluginsSchema.index({ deploymentID: 1, pluginName: 1 }, { unique: true });

const deploymentPluginsModel = newModel(
  mongoose.connection,
  'package-manager_DeploymentPlugins',
  deploymentPluginsSchema
);

module.exports = { deploymentPluginsModel };
