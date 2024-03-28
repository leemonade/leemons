const _ = require('lodash');
const { isCoreService } = require('@leemons/deployment-manager');
const { getPluginNameFromServiceName } = require('@leemons/service-name-parser');

async function getAllPluginsAndRelations(broker) {
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

  return { pluginNames: _.uniq(pluginNames), relationship };
}

module.exports = { getAllPluginsAndRelations };
