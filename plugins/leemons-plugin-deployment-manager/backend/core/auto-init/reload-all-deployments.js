const { deploymentModel } = require('../../models/deployment');
const { getAllPluginsAndRelations } = require('./getAllPluginsAndRelations');

async function reloadAllDeployments({ broker, ids = [], reloadRelations }) {
  const query = ids.length ? { id: ids } : {};
  const deployments = await deploymentModel.find(query).lean();
  let payload = {};

  if (reloadRelations) {
    payload = await getAllPluginsAndRelations(broker);
  }

  for (let i = 0, l = deployments.length; i < l; i++) {
    // We simulate that the store tells us to start this deploymentID.
    // eslint-disable-next-line no-await-in-loop
    await broker.call('deployment-manager.initDeployment', payload, {
      meta: { deploymentID: deployments[i].id },
    });
  }

  return deployments.length;
}

module.exports = { reloadAllDeployments };
