const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');
/**
 * ES: Los plugins que ya existan los actualiza los que no los añade
 */
async function canCallMe(ctx) {
  if (!ctx.params || !ctx.params?.toAction) {
    throw new LeemonsError(ctx, { message: 'toAction is required' });
  }
  if (!ctx.params || !ctx.params?.fromService) {
    throw new LeemonsError(ctx, { message: 'toAction is required' });
  }
  if (!ctx.params || !ctx.params?.relationshipID) {
    throw new LeemonsError(ctx, { message: 'relationshipID is required' });
  }

  const fromPluginName = getPluginNameFromServiceName(ctx.params.fromService);
  const toPluginName = getPluginNameFromServiceName(ctx.params.toAction);
  const toPluginNameReCheck = getPluginNameFromServiceName(ctx.caller);

  if (toPluginNameReCheck !== toPluginName)
    throw new LeemonsError(ctx, {
      message: 'The calling plugin and the action you are trying to check do not match',
    });

  const relationship = await ctx.db.DeploymentPluginsRelationship.findOne({
    _id: ctx.params.relationshipID,
    fromPluginName,
    toPluginName,
    actions: ctx.params.toAction,
  }).lean();

  if (!relationship) {
    throw new LeemonsError(ctx, {
      message: 'Your plugin don´t have access to call this plugin to this action.',
      fromPluginName,
      toPluginName,
      toActionName: ctx.params.toAction,
    });
  }
}

module.exports = { canCallMe };
