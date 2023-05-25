const _ = require('lodash');
const {
  getAutoDeploymentIDIfCanIFNotThrowError,
  isCoreService,
} = require('leemons-deployment-manager');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');

async function autoInit(broker) {
  const deploymentID = getAutoDeploymentIDIfCanIFNotThrowError();
  const plugins = [];
  const relationship = [];
  _.forEach(broker.services, (fromService) => {
    if (!isCoreService(fromService.name)) {
      const fromPluginName = getPluginNameFromServiceName(fromService.name);
      plugins.push({
        pluginName: fromPluginName,
        pluginVersion: 1,
      });
      _.forEach(broker.services, (toService) => {
        if (!isCoreService(toService.name)) {
          const actions = [];
          _.forIn(toService.actions, (value, key) => {
            actions.push(`${toService.fullName}.${key}`);
          });
          relationship.push({
            fromPluginName,
            toPluginName: getPluginNameFromServiceName(toService.name),
            actions,
          });
        }
      });
    }
  });
  await broker.call('deployment-manager.savePlugins', plugins, { meta: { deploymentID } });
  await broker.call('deployment-manager.savePluginsRelationships', relationship, {
    meta: { deploymentID },
  });
}

module.exports = { autoInit };
