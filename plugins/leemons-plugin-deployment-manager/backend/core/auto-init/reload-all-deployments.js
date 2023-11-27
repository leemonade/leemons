const { deploymentModel } = require('../../models/deployment');

async function reloadAllDeployments(broker) {
  const deployments = await deploymentModel.find({}).lean();

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
}

module.exports = { reloadAllDeployments };
