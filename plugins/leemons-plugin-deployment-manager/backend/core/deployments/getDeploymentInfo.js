const { deploymentModel } = require('../../models/deployment');

async function getDeploymentInfo({ id }) {
  const query = id?.length ? { id } : {};
  const deployment = await deploymentModel.find(query).lean();
  if (deployment) {
    deployment.type = deployment.type ?? 'free';
  }
  return deployment;
}

module.exports = {
  getDeploymentInfo,
};
