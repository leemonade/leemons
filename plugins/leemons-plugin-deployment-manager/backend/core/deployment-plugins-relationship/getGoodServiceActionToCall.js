const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const {
  getPluginNameFromServiceName,
  getActionWithOutVersion,
} = require('leemons-service-name-parser');

async function getGoodServiceActionToCall(ctx) {
  if (!ctx.params || !ctx.params?.actionName) {
    throw new LeemonsError(ctx, { message: 'actionName is required' });
  }
  // TODO [!!!] Asegurar que el caller es quien dice ser
  const fromPluginName = getPluginNameFromServiceName(ctx.caller);
  const toPluginName = getPluginNameFromServiceName(ctx.params.actionName);

  const relationship = await ctx.db.DeploymentPluginsRelationship.findOne({
    fromPluginName,
    toPluginName,
  }).lean();
  if (!relationship) {
    throw new LeemonsError(ctx, {
      message: `relationship from "${fromPluginName}" to "${toPluginName}" not found`,
      fromPluginName,
      toPluginName,
      toActionName: ctx.params.actionName,
    });
  }
  const actionName = getActionWithOutVersion(ctx.params.actionName);
  const goodAction = _.find(
    relationship.actions,
    (action) => getActionWithOutVersion(action) === actionName
  );
  if (!goodAction) {
    throw new LeemonsError(ctx, {
      message: `plugin "${fromPluginName}" don´t have access to call the function "${actionName}" of plugin "${toPluginName}"`,
      fromPluginName,
      toPluginName,
      toActionName: ctx.params.actionName,
    });
  }
  return {
    actionToCall: goodAction,
    relationshipID: relationship._id,
  };
}

module.exports = { getGoodServiceActionToCall };
