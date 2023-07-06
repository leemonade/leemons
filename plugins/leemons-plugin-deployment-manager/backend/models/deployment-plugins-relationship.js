const { mongoose, newModel } = require('leemons-mongodb');

const deploymentPluginsRelationshipSchema = new mongoose.Schema(
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
  { timestamps: true }
);

deploymentPluginsRelationshipSchema.index(
  { deploymentID: 1, fromPluginName: 1, toPluginName: 1 },
  { unique: true }
);

const deploymentPluginsRelationshipModel = newModel(
  mongoose.connection,
  'package-manager_DeploymentPluginsRelationship',
  deploymentPluginsRelationshipSchema
);

module.exports = { deploymentPluginsRelationshipModel };
