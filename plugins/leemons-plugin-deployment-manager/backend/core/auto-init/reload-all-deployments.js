const { deploymentModel } = require('../../models/deployment');

async function reloadAllDeployments(broker, deploymentIds = []) {
  const query = deploymentIds.length ? { id: deploymentIds } : {};
  const deployments = await deploymentModel.find(query).lean();

  for (let i = 0, l = deployments.length; i < l; i++) {
    // We simulate that the store tells us to start this deploymentID.
    // eslint-disable-next-line no-await-in-loop
    await broker.call(
      'deployment-manager.initDeployment',
      {},
      {
        meta: { deploymentID: deployments[i].id },
      }
    );
  }

  return deployments.length;
}

module.exports = { reloadAllDeployments };
