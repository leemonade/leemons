const _ = require('lodash');
/**
 * ES: Los plugins que ya existan los actualiza los que no los añade
 */
async function savePluginsToDeployment(ctx, params) {
  await ctx.tx.db.DeploymentPlugins.deleteMany({
    $or: _.map(params, (param) => ({
      deploymentID: ctx.meta.deploymentID,
      pluginName: param.pluginName,
    })),
  });
  await ctx.tx.db.DeploymentPlugins.insertMany(
    _.map(params, (param) => ({
      ...param,
      deploymentID: ctx.meta.deploymentID,
    })),
    {
      ordered: false,
      lean: true,
    }
  );
}

module.exports = { savePluginsToDeployment };
