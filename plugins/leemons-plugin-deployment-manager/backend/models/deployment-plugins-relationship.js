const { mongoose, newModel } = require("leemons-mongodb");

const deploymentPluginsRelationshipSchema = new mongoose.Schema(
  {
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    fromPluginName: {
      type: String,
      required: true,
    },
    toPluginName: {
      type: String,
      required: true,
    },
    actions: [String],
  },
  { timestamps: true }
);

let deploymentPluginsRelationshipModel = newModel(
  mongoose.connection,
  "package-manager_DeploymentPluginsRelationship",
  deploymentPluginsRelationshipSchema
);

module.exports = { deploymentPluginsRelationshipModel };
