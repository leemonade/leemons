const _ = require('lodash');
const { getAutoDeploymentIDIfCanIFNotThrowError } = require('leemons-deployment-manager');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');

const ignoreNames = ['$node', 'deployment-manager', 'gateway'];

async function autoInit(broker) {
  const deploymentID = getAutoDeploymentIDIfCanIFNotThrowError();
  const plugins = [];
  const relationship = [];
  _.forEach(broker.services, (fromService) => {
    if (!ignoreNames.includes(fromService.name)) {
      const fromPluginName = getPluginNameFromServiceName(fromService.name);
      plugins.push({
        pluginName: fromPluginName,
        pluginVersion: 1,
      });
      _.forEach(broker.services, (toService) => {
        if (!ignoreNames.includes(toService.name) && toService.name !== fromService.name) {
          const actions = [];
          _.forIn(toService.actions, (value, key) => {
            actions.push(`${toService.name}.${key}`);
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
