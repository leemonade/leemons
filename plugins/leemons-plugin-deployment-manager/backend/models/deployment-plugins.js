const { mongoose, newModel } = require("leemons-mongodb");

const deploymentPluginsSchema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
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
  { timestamps: true }
);

let deploymentPluginsModel = newModel(
  mongoose.connection,
  "package-manager_DeploymentPlugins",
  deploymentPluginsSchema
);

module.exports = { deploymentPluginsModel };
