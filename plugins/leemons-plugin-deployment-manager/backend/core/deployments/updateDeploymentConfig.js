const { LeemonsError } = require('@leemons/error');

async function updateDeploymentConfig({ ctx, deploymentID, domains, config }) {
  let query = {
    domains: { $in: domains },
  };
  if (deploymentID) query = { id: deploymentID };
  const count = await ctx.db.deployment.countDocuments(query);
  if (!count) {
    throw new LeemonsError(ctx, { message: 'Deployment not found' });
  }
  if (count > 1) {
    throw new LeemonsError(ctx, { message: 'More than one deployment found' });
  }
  await ctx.db.deployment.updateOne(query, { $set: { config } });
  await ctx.tx.emit('config-change');
  return true;
}

module.exports = { updateDeploymentConfig };
