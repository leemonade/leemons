/**
 * @typedef {import('@leemons/deployment-manager').Context} Context
 * @typedef {import('./savePluginsToDeployment').Plugin} LeemonsPlugin
 */

/**
 * Remove plugins from a deployment
 *
 * @param {Object} params
 * @param {Context} params.ctx - The context object, typically provided by the Moleculer framework.
 * @param {Array<LeemonsPlugin>} params.plugins - An array of plugin objects to be removed from the deployment.
 * @throws {Error} Throws an error if the database operations fail.
 *
 * @example
 * await removePluginsFromDeployment(ctx, [
 *   { pluginName: 'my-plugin', pluginVersion: '1.0.0' },
 *   { pluginName: 'another-plugin', pluginVersion: '2.1.0' }
 * ]);
 *
 * @returns {Promise<number>} A promise that resolves to the number of plugins removed from the deployment.
 */
async function removePluginsFromDeployment({ ctx, plugins }) {
  const result = await ctx.tx.db.DeploymentPlugins.deleteMany({
    $or: plugins.map((plugin) => ({
      deploymentID: ctx.meta.deploymentID,
      pluginName: plugin.pluginName,
    })),
  });

  return result.deletedCount;
}

module.exports = { removePluginsFromDeployment };
