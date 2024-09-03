async function getDeploymentPlugins(ctx) {
  const result = await ctx.tx.db.DeploymentPlugins.find({
    deploymentID: ctx.meta.deploymentID,
  });

  return result.map((r) => r.pluginName);
}

module.exports = {
  getDeploymentPlugins,
};
