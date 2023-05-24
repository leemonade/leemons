const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
/**
 * ES: Los plugins que ya existan los actualiza los que no los añade
 */
async function savePluginsRelationshipsToDeployment(ctx, params) {
  let pluginNames = [];
  _.forEach(params, (param) => {
    pluginNames.push(param.fromPluginName);
    pluginNames.push(param.toPluginName);
  });
  pluginNames = _.uniq(pluginNames);
  const nPlugins = await ctx.tx.db.DeploymentPlugins.countDocuments({
    deploymentID: ctx.meta.deploymentID,
    pluginName: pluginNames,
  });
  if (nPlugins !== pluginNames.length) {
    throw new LeemonsError(ctx, {
      message: 'One of the plugins you are trying to link is not installed within the deployment.',
    });
  }
  await ctx.tx.db.DeploymentPluginsRelationship.deleteMany({
    $or: _.map(params, (param) => ({
      deploymentID: ctx.meta.deploymentID,
      fromPluginName: param.fromPluginName,
      toPluginName: param.toPluginName,
    })),
  });
  await ctx.tx.db.DeploymentPluginsRelationship.insertMany(
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

module.exports = { savePluginsRelationshipsToDeployment };
