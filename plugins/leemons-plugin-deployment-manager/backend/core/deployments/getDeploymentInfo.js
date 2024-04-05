const { deploymentModel } = require('../../models/deployment');

async function getDeploymentInfo({ id }) {
  const query = id?.length ? { id } : {};
  return deploymentModel.find(query).lean();
}

module.exports = {
  getDeploymentInfo,
};
