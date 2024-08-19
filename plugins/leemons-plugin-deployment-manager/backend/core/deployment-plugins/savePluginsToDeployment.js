/**
 * @typedef {import('moleculer').Context} MoleculerContext
 */

const { removePluginsFromDeployment } = require('./removePluginsFromDeployment');

/**
 * @typedef {Object} Plugin
 * @property {string} pluginName - The name of the plugin.
 * @property {string} pluginVersion - The version of the plugin.
 */

/**
 * Updates or adds plugins to a specific deployment in the Leemons application.
 *
 * This function is responsible for maintaining an up-to-date record of plugins
 * associated with a particular deployment. It operates in two steps:
 * 1. Removes existing plugin entries for the given deployment.
 * 2. Inserts new entries for all plugins provided in the params.
 *
 * The function is idempotent, allowing for safe repeated calls with the same data.
 * This is particularly useful for deployment updates or reconfiguration scenarios.
 *
 * @async
 * @function savePluginsToDeployment
 * @param {MoleculerContext} ctx - The context object, typically provided by the Moleculer framework.
 * @param {Array<Plugin>} plugins - An array of plugin objects to be saved or updated.
 * @throws {Error} Throws an error if the database operations fail.
 *
 * @example
 * await savePluginsToDeployment(ctx, [
 *   { pluginName: 'my-plugin', pluginVersion: '1.0.0' },
 *   { pluginName: 'another-plugin', pluginVersion: '2.1.0' }
 * ]);
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @description
 * This function plays a crucial role in the Leemons deployment manager plugin.
 * It ensures that the DeploymentPlugins collection accurately reflects the
 * current state of plugins for each deployment. This is essential for:
 *
 * 1. Plugin Management: Keeping track of which plugins are active in each deployment.
 * 2. Version Control: Maintaining records of plugin versions for compatibility checks.
 * 3. Deployment Configuration: Allowing for easy reconfiguration of deployments.
 * 4. System Integrity: Ensuring that the system's understanding of its plugin ecosystem is always up-to-date.
 *
 * The function uses bulk operations for efficiency, with `ordered: false` to allow
 * for parallel processing of inserts, and `lean: true` to optimize performance by
 * returning plain JavaScript objects instead of Mongoose documents.
 *
 * Note: This function assumes that the caller has the necessary permissions to
 * modify deployment configurations. It should be called only from authorized
 * services or admin-level operations.
 */
async function savePluginsToDeployment(ctx, plugins) {
  await removePluginsFromDeployment({ ctx, plugins });

  await ctx.tx.db.DeploymentPlugins.insertMany(
    plugins.map((plugin) => ({
      ...plugin,
      deploymentID: ctx.meta.deploymentID,
    })),
    {
      ordered: false,
      lean: true,
    }
  );
}

module.exports = { savePluginsToDeployment };
