const { LeemonsError } = require('@leemons/error');
const { deploymentModel } = require('../../models/deployment');

async function updateDeploymentConfig({ ctx, deploymentID, domains, config }) {
  let query = {
    domains: { $in: domains },
  };
  if (deploymentID) query = { id: deploymentID };
  const count = await deploymentModel.countDocuments(query);
  if (!count) {
    throw new LeemonsError(ctx, { message: 'Deployment not found' });
  }
  if (count > 1) {
    throw new LeemonsError(ctx, { message: 'More than one deployment found' });
  }
  await deploymentModel.updateOne(query, { $set: { config } });
  return true;
}

module.exports = { updateDeploymentConfig };
