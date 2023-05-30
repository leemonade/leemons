const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getPluginNameFromServiceName } = require('leemons-service-name-parser');

/**
 * Esta función comprueba si quien quiere llamar tiene acceso a hacer
 * dicha llamada y si es quien dice ser, ya que se supone que el relationshipID
 * solo lo deberia de poder conseguir el dueño de un plugin que quiera llamar a otro.
 */
async function canCallMe(ctx) {
  if (!ctx.params || (!ctx.params?.toAction && !ctx.params?.toEvent)) {
    throw new LeemonsError(ctx, { message: 'toAction or toEvent is required' });
  }
  if (!ctx.params || !ctx.params?.fromService) {
    throw new LeemonsError(ctx, { message: 'fromService is required' });
  }
  if (!ctx.params || !ctx.params?.relationshipID) {
    throw new LeemonsError(ctx, { message: 'relationshipID is required' });
  }

  const fromPluginName = getPluginNameFromServiceName(ctx.params.fromService);
  const toPluginName = getPluginNameFromServiceName(ctx.params.toAction || ctx.caller);
  const toPluginNameReCheck = getPluginNameFromServiceName(ctx.caller);

  if (ctx.params.toAction) {
    if (toPluginNameReCheck !== toPluginName)
      throw new LeemonsError(ctx, {
        message: 'The calling plugin and the action you are trying to check do not match',
      });
  }

  const query = {
    _id: ctx.params.relationshipID,
    fromPluginName,
    toPluginName,
  };

  if (ctx.params.toAction) {
    query.actions = ctx.params.toAction;
  } else {
    query.events = ctx.params.toEvent;
  }

  const relationship = await ctx.db.DeploymentPluginsRelationship.findOne(query).lean();

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
