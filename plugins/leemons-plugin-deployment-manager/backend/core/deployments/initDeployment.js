const { newTransaction } = require('@leemons/transactions');
const { randomString } = require('@leemons/utils');
const _ = require('lodash');

/**
 * Initializes a new deployment in the Leemons application.
 *
 * This function orchestrates the entire deployment process, including:
 * - Saving specified plugins to the deployment
 * - Establishing relationships between plugins
 * - Creating a new transaction for the deployment process
 * - Generating a unique deployment process number
 * - Triggering installation events for all plugins
 * - Finalizing the deployment process
 *
 * The function coordinates between different parts of the Leemons system to ensure
 * a complete and consistent initialization of the deployment.
 *
 * @async
 * @function initDeployment
 * @param {Object} params - The parameters for initializing the deployment.
 * @param {string[]} [params.pluginNames] - An array of plugin names to be installed in this deployment.
 *                                          If provided, these plugins will be saved to the deployment.
 * @param {Object[]} [params.relationship] - An array of objects defining relationships between plugins.
 *                                           If provided, these relationships will be saved to the deployment.
 * @param {import('moleculer').Context} params.ctx - The Moleculer context object, which includes
 *                                                   methods for logging, calling other services, and
 *                                                   accessing the current transaction.
 * @throws {Error} Throws an error if the deployment initialization process fails at any stage.
 *
 * @example
 * await initDeployment({
 *   pluginNames: ['plugin1', 'plugin2'],
 *   relationship: [{ fromPlugin: 'plugin1', toPlugin: 'plugin2', actions: ['action1', 'action2'] }],
 *   ctx: moleculerContext
 * });
 */
async function initDeployment({ pluginNames, relationship, ctx }) {
  ctx.meta.transactionID = ctx.meta.transactionID ?? (await newTransaction(ctx));
  ctx.meta.initDeploymentProcessNumber = ctx.meta.initDeploymentProcessNumber ?? randomString();
  ctx.logger = ctx.logger ?? console;

  if (pluginNames) {
    ctx.logger.info('- Init Deployment - SavePlugins');
    await ctx.tx.call(
      'deployment-manager.savePlugins',
      _.uniq(pluginNames).map((pluginName) => ({
        pluginName,
        pluginVersion: 1,
      }))
    );
  }

  if (relationship) {
    ctx.logger.info('- Init Deployment - SavePluginsRelationships');
    await ctx.tx.call('deployment-manager.savePluginsRelationships', relationship);
  }

  await ctx.call('deployment-manager.emit', {
    event: 'deployment-manager.install',
  });

  await ctx.call('deployment-manager.emit', {
    event: 'deployment-manager.finish',
  });
}

module.exports = {
  initDeployment,
};
