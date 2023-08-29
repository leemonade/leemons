const _ = require('lodash');
const {
  getAutoDeploymentIDIfCanIFNotThrowError,
  isCoreService,
} = require('leemons-deployment-manager');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');

async function autoInit(broker) {
  // This function return a default deploymentID if not DISABLE_AUTO_INIT
  const deploymentID = getAutoDeploymentIDIfCanIFNotThrowError();
  const pluginNames = [];
  const relationship = [];
  _.forEach(broker.services, (fromService) => {
    if (!isCoreService(fromService.name)) {
      const fromPluginName = getPluginNameFromServiceName(fromService.name);
      pluginNames.push(fromPluginName);
      _.forEach(broker.services, (toService) => {
        if (!isCoreService(toService.name)) {
          const toPluginName = getPluginNameFromServiceName(toService.name);
          const actions = [];
          const events = [];
          _.forIn(toService.actions, (value, key) => {
            actions.push(`${toService.fullName}.${key}`);
          });
          _.forIn(toService.events, (value, key) => {
            if (!key.includes('*')) {
              events.push(key);
            } else {
              console.warn('Wilcards in events not allowed');
            }
          });
          let index = _.findIndex(relationship, { fromPluginName, toPluginName });
          if (index < 0) {
            relationship.push({
              fromPluginName,
              toPluginName,
              actions: [],
              events: [],
            });
            index = relationship.length - 1;
          }
          relationship[index].actions.push(...actions);
          relationship[index].events.push(...events);
        }
      });
    }
  });

  _.forEach(relationship, (rel, index) => {
    relationship[index].actions = _.uniq(rel.actions);
    relationship[index].events = _.uniq(rel.events);
  });
  // We simulate that the store adds the plugins that are installed for this deploymentID
  console.log('- Auto init - Pre SavePlugins');
  await broker.call(
    'deployment-manager.savePlugins',
    _.map(_.uniq(pluginNames), (pluginName) => ({
      pluginName,
      pluginVersion: 1,
    })),
    { meta: { deploymentID } }
  );
  console.log('- Auto init - Post SavePlugins');
  console.log('- Auto init - Pre SavePluginsRelationships');
  // We simulate that the store adds the permissions between the actions of the
  await broker.call('deployment-manager.savePluginsRelationships', relationship, {
    meta: { deploymentID },
  });
  console.log('- Auto init - Post SavePluginsRelationships');
  console.log('- Auto init - Pre InitDeployment');
  // We simulate that the store tells us to start this deploymentID.
  await broker.call('deployment-manager.initDeployment', relationship, {
    meta: { deploymentID },
  });
  console.log('- Auto init - Post InitDeployment');
}

module.exports = { autoInit };
