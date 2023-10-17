const { ObjectId } = require('mongodb');
const { getDeploymentIDFromCTX } = require('@leemons/deployment-manager');
const { getPluginNameFromCTX } = require('@leemons/service-name-parser');

function getLRNConfig({ modelKey, ctx }) {
  return {
    partition: process.env.PARTITION || 'local',
    pluginName: getPluginNameFromCTX(ctx),
    region: process.env.REGION || 'local',
    deploymentID: getDeploymentIDFromCTX(ctx),
    modelName: modelKey,
    resourceID: new ObjectId(),
  };
}

module.exports = { getLRNConfig };
