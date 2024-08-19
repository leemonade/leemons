const { LeemonsError } = require('@leemons/error');
const { newTransaction, addTransactionState } = require('@leemons/transactions');

const { getAllPluginsAndRelations } = require('../auto-init/getAllPluginsAndRelations');

const { getDeploymentInfo } = require('./getDeploymentInfo');

/**
 * @typedef {import('../auto-init/getAllPluginsAndRelations').PluginRelations} PluginRelations
 * @typedef {import('../auto-init/getAllPluginsAndRelations').PluginRelationship} PluginRelationship
 */

async function addPluginsToDeployment({ ctx, broker, id, plugins }) {
  const deployment = await getDeploymentInfo({ id });

  if (!deployment) {
    throw new LeemonsError(ctx, { message: 'Deployment not found' });
  }

  /** @type PluginRelations */
  const { pluginNames, relationship } = await getAllPluginsAndRelations(broker);

  const pluginsToAdd = pluginNames.filter((plugin) => plugins.includes(plugin));

  if (pluginsToAdd.length === 0) {
    throw new LeemonsError(ctx, { message: 'Plugins not found' });
  }

  /** @type PluginRelationship[] */
  const relationshipToAdd = relationship.filter(
    (relation) =>
      pluginsToAdd.includes(relation.fromPluginName) || pluginsToAdd.includes(relation.toPluginName)
  );

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
