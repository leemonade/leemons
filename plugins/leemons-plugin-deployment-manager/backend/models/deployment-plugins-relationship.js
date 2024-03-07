const { mongoose, newModel } = require('@leemons/mongodb');

const deploymentPluginsRelationshipSchema = new mongoose.Schema(
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
    fromPluginName: {
      type: String,
      required: true,
    },
    toPluginName: {
      type: String,
      required: true,
    },
    actions: [String],
    events: [String],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

deploymentPluginsRelationshipSchema.index(
  { deploymentID: 1, fromPluginName: 1, toPluginName: 1 },
  { unique: true }
);

deploymentPluginsRelationshipSchema.index({ pluginName: 1, deploymentID: 1, isDeleted: 1 });
deploymentPluginsRelationshipSchema.index({
  fromPluginName: 1,
  toPluginName: 1,
  deploymentID: 1,
  isDeleted: 1,
});
deploymentPluginsRelationshipSchema.index({
  domains: 1,
  deploymentID: 1,
  isDeleted: 1,
});

const deploymentPluginsRelationshipModel = newModel(
  mongoose.connection,
  'package-manager_DeploymentPluginsRelationship',
  deploymentPluginsRelationshipSchema
);

module.exports = { deploymentPluginsRelationshipModel };
