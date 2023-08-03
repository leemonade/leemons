async function isInstalled({ pluginName, ctx }) {
  const result = await ctx.tx.db.DeploymentPlugins.countDocuments({
    deploymentID: ctx.meta.deploymentID,
    pluginName,
  });
  return !!result;
}

module.exports = { isInstalled };
