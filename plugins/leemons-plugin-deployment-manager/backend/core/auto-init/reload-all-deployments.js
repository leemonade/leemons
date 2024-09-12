const _ = require('lodash');

const { deploymentModel } = require('../../models/deployment');
const { deploymentPluginsModel } = require('../../models/deployment-plugins');

const { getAllPluginsAndRelations } = require('./getAllPluginsAndRelations');

async function reloadAllDeployments({ broker, ids = [], reloadRelations, includeAllPlugins }) {
  const query = ids.length ? { id: ids } : {};
  const deployments = await deploymentModel.find(query).lean();
  let allPluginsAndRelations = {};
  let installedPluginsByDeployment = {};

  if (reloadRelations) {
    allPluginsAndRelations = await getAllPluginsAndRelations(broker);
  }

  // Get installed plugins and relations
  if (reloadRelations && !includeAllPlugins) {
    const installedPlugins = await deploymentPluginsModel
      .find({ deploymentID: { $in: deployments.map((d) => d.id) } })
      .lean();
    installedPluginsByDeployment = _.groupBy(installedPlugins, 'deploymentID');
  }

  for (let i = 0, l = deployments.length; i < l; i++) {
    const deployment = deployments[i];
    let pluginsAndRelations = allPluginsAndRelations;

    if (reloadRelations && !includeAllPlugins) {
      const pluginNames = installedPluginsByDeployment[deployment.id].map((p) => p.pluginName);
      pluginsAndRelations = {
        pluginNames,
        relationship: allPluginsAndRelations.relationship.filter(
          (r) => pluginNames.includes(r.fromPluginName) && pluginNames.includes(r.toPluginName)
        ),
      };
    }

    // We simulate that the external "service-catalog" tells us to start this deploymentID.
    // eslint-disable-next-line no-await-in-loop
    await broker.call('deployment-manager.initDeployment', pluginsAndRelations, {
      meta: { deploymentID: deployment.id },
    });
  }

  return deployments.length;
}

module.exports = { reloadAllDeployments };
