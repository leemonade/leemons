const { LeemonsError } = require('@leemons/error');
const { newTransaction, addTransactionState } = require('@leemons/transactions');

const { getAllPluginsAndRelations } = require('../auto-init/getAllPluginsAndRelations');
const { getDeploymentPlugins } = require('../deployment-plugins/getDeploymentPlugins');

const { getDeploymentInfo } = require('./getDeploymentInfo');

/**
 * @typedef {import('../auto-init/getAllPluginsAndRelations').PluginRelations} PluginRelations
 * @typedef {import('../auto-init/getAllPluginsAndRelations').PluginRelationship} PluginRelationship
 */

async function addPluginsToDeployment({ ctx, broker, id, plugins: newPlugins }) {
  const deployment = await getDeploymentInfo({ id });

  if (!deployment) {
    throw new LeemonsError(ctx, { message: 'Deployment not found' });
  }

  /** @type PluginRelations */
  const installedPlugins = await getDeploymentPlugins(ctx);

  const { pluginNames, relationship } = await getAllPluginsAndRelations(broker);
  const pluginNamesSet = new Set(pluginNames);

  const installedPluginsSet = new Set(installedPlugins);

  const pluginsToAdd = newPlugins.filter(
    (plugin) => !installedPluginsSet.has(plugin) && pluginNamesSet.has(plugin)
  );

  if (pluginsToAdd.length === 0) {
    throw new LeemonsError(ctx, { message: 'Plugins not found' });
  }

  // Add pluginsToAdd to the installedPluginsSet
  pluginsToAdd.forEach((plugin) => installedPluginsSet.add(plugin));

  /** @type PluginRelationship[] */
  let relationshipToAdd = relationship.filter(
    (relation) =>
      pluginsToAdd.includes(relation.fromPluginName) || pluginsToAdd.includes(relation.toPluginName)
  );

  relationshipToAdd = relationshipToAdd.filter((relation) => installedPluginsSet.has(relation.fromPluginName) && installedPluginsSet.has(relation.toPluginName));

  ctx.meta.deploymentID = id;
  ctx.meta.transactionID = await newTransaction(ctx);

  await addTransactionState(ctx, {
    action: 'leemonsMongoDBRollback',
    payload: {
      modelKey: 'Deployment',
      action: 'removeMany',
      data: [id],
    },
  });

  await ctx.tx.call('deployment-manager.initDeployment', {
    pluginNames: pluginsToAdd,
    relationship: relationshipToAdd,
  });
}

module.exports = {
  addPluginsToDeployment,
};
