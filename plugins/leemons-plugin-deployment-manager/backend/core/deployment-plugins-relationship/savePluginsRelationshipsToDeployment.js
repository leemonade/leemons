const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

/**
 * @typedef {import('../auto-init/getAllPluginsAndRelations').PluginRelationship} PluginRelationship
 * @typedef {import('@leemons/deployment-manager').Context} Context
 */

/**
 * Saves or updates plugin relationships for a specific deployment in the Leemons application.
 *
 * This function is a critical component of the Leemons deployment manager plugin. It manages
 * the relationships between plugins within a deployment, ensuring that only valid and current
 * relationships are maintained in the system.
 *
 * The function performs the following steps:
 * 1. Extracts and deduplicates all plugin names from the provided relationships.
 * 2. Verifies that all referenced plugins are actually installed in the current deployment.
 * 3. Removes any existing relationships for the involved plugins to prevent stale data.
 * 4. Inserts the new relationships into the database.
 *
 * This process is crucial for maintaining the integrity of the plugin ecosystem, as these
 * relationships determine which plugins can interact with each other and in what ways.
 *
 * @async
 * @function savePluginsRelationshipsToDeployment
 * @param {Context} ctx - The context object, typically provided by the Moleculer framework.
 *                       It should contain transaction (tx) and metadata (meta) properties.
 * @param {PluginRelationship[]} relationships - An array of relationship objects to be saved.
 *
 * @throws {LeemonsError} Throws an error if any of the plugins in the relationships are not installed
 *                        in the current deployment.
 *
 * @example
 * await savePluginsRelationshipsToDeployment(ctx, [
 *   {
 *     fromPluginName: 'plugin1',
 *     toPluginName: 'plugin2',
 *     actions: ['action1', 'action2'],
 *     events: ['event1']
 *   },
 * ]);
 *
 * @returns {Promise<void>} A promise that resolves when all relationships have been saved successfully.
 *
 * @description
 * This function plays a key role in the Leemons plugin architecture by:
 * - Ensuring data integrity: Only relationships between actually installed plugins are saved.
 * - Maintaining current data: Old relationships are removed before new ones are added.
 * - Supporting flexible plugin interactions: Allows for dynamic definition of inter-plugin relationships.
 * - Enhancing security: Provides a basis for the system to check if one plugin is allowed to interact with another.
 *
 * The relationships saved by this function are typically used by other parts of the system,
 * such as the `canCallMe` function, to determine at runtime if a plugin has permission to
 * call actions or events of another plugin.
 */
async function savePluginsRelationshipsToDeployment(ctx, relationships) {
  let pluginNames = [];

  _.forEach(relationships, (relationship) => {
    pluginNames.push(relationship.fromPluginName);
    pluginNames.push(relationship.toPluginName);
  });

  pluginNames = _.uniq(pluginNames);
  const nPlugins = await ctx.tx.db.DeploymentPlugins.countDocuments({
    deploymentID: ctx.meta.deploymentID,
    pluginName: pluginNames,
  });

  if (nPlugins !== pluginNames.length) {
    throw new LeemonsError(ctx, {
      message: 'One of the plugins you are trying to link is not installed within the deployment.',
    });
  }
  await ctx.tx.db.DeploymentPluginsRelationship.deleteMany({
    $or: _.map(relationships, (relationship) => ({
      deploymentID: ctx.meta.deploymentID,
      fromPluginName: relationship.fromPluginName,
      toPluginName: relationship.toPluginName,
    })),
  });
  await ctx.tx.db.DeploymentPluginsRelationship.insertMany(
    _.map(relationships, (relationship) => ({
      ...relationship,
      deploymentID: ctx.meta.deploymentID,
    })),
    {
      ordered: false,
      lean: true,
    }
  );
}

module.exports = { savePluginsRelationshipsToDeployment };
