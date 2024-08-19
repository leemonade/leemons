const { isCoreService } = require('@leemons/deployment-manager');
const { getPluginNameFromServiceName } = require('@leemons/service-name-parser');
const _ = require('lodash');

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker
 */

/**
 * @typedef {Object} PluginRelationship
 * @property {string} fromPluginName - The name of the source plugin in the relationship.
 * @property {string} toPluginName - The name of the target plugin in the relationship.
 * @property {string[]} actions - An array of action names that the source plugin can call on the target plugin.
 * @property {string[]} events - An array of event names that the source plugin can listen to from the target plugin.
 */

/**
 * @typedef {Object} PluginRelations
 * @property {string[]} pluginNames - An array of unique plugin names found in the broker.
 * @property {PluginRelationship[]} relationship - An array of objects describing the relationships between plugins.
 */

/**
 * Analyzes all services (plugins) registered in the broker and gathers information about their relationships and actions.
 * This function is crucial for the deployment manager to understand and manage plugin interactions within the Leemons ecosystem.
 *
 * @param {ServiceBroker} broker - The Moleculer service broker instance containing all registered services.
 * @returns {Promise<PluginRelations>} An object containing plugin names and their relationships.
 *
 * @description
 * This function performs the following steps:
 * 1. Iterates through all services in the broker.
 * 2. Extracts plugin names and adds them to the pluginNames array.
 * 3. For each plugin, it analyzes its relationships with other plugins by:
 *    - Collecting all actions and events of the target plugin.
 *    - Storing this information in the relationship array.
 * 4. Removes duplicate actions and events from the relationships.
 * 5. Returns the collected data for use in managing plugin interactions and dependencies.
 *
 * The gathered information is essential for:
 * - Setting up proper access controls between plugins.
 * - Managing dependencies between plugins.
 * - Ensuring plugins only call authorized actions or listen to permitted events.
 * - Facilitating the auto-initialization process of the deployment manager.
 *
 * @example
 * const broker = // ... Moleculer service broker instance
 * const { pluginNames, relationship } = await getAllPluginsAndRelations(broker);
 * console.log('Plugins:', pluginNames);
 * console.log('Relationships:', relationship);
 */
async function getAllPluginsAndRelations(broker) {
  const pluginNames = [];
  /** @type PluginRelationship[] */
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
