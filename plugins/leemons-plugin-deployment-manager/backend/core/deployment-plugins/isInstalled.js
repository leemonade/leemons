const _ = require('lodash');

async function isInstalled({ pluginName, ctx }) {
  const pluginNames = _.flatten([pluginName]);
  const result = await ctx.tx.db.DeploymentPlugins.countDocuments({
    deploymentID: ctx.meta.deploymentID,
    pluginName: pluginNames,
  });
  return result === pluginNames.length;
}

module.exports = { isInstalled };
