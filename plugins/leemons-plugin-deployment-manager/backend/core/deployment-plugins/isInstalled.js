const _ = require('lodash');

async function isInstalled({ pluginName, ctx }) {
  const pluginNames = _.isArray(pluginName) ? pluginName : [pluginName];
  const result = await ctx.tx.db.DeploymentPlugins.countDocuments({
    deploymentID: ctx.meta.deploymentID,
    pluginName: pluginNames,
  });
  return result === pluginName.length;
}

module.exports = { isInstalled };
